"""
Example script demonstrating how to record voice and match against the database
"""
import os
import sys
from pathlib import Path

# Add the application path to the Python path
app_path = Path(__file__).parent
sys.path.append(str(app_path))

from app.voice_processing.noise_reduction import NoiseReducer
from app.feature_extraction.voice_features import VoiceFeatureExtractor
from app.matching_engine.voice_matcher import VoiceMatcher
from app.database.voice_db import VoiceDatabase
from app.api.api_interface import VoiceRecognitionAPI

def main():
    # Initialize components
    db_path = Path("data") / "voice_recognition.db"
    db_manager = VoiceDatabase(str(db_path))
    voice_processor = NoiseReducer()
    feature_extractor = VoiceFeatureExtractor()
    voice_matcher = VoiceMatcher()
    
    # Create API interface
    api = VoiceRecognitionAPI(db_manager, voice_processor, voice_matcher)
    
    # Load existing database if available
    matcher_db_path = Path("data") / "matcher_database.pkl"
    if matcher_db_path.exists():
        voice_matcher.load_database(matcher_db_path)
        print(f"Loaded existing database with {len(voice_matcher.fingerprints)} voice samples")
    
    # Display menu
    while True:
        print("\n===== Voice Recognition System =====")
        print("1. Record and match voice")
        print("2. View stored records")
        print("3. Exit")
        
        choice = input("\nEnter your choice (1-3): ")
        
        if choice == '1':
            record_and_match(api, db_manager, voice_matcher, matcher_db_path)
        elif choice == '2':
            view_stored_records(db_manager)
        elif choice == '3':
            print("Exiting application...")
            break
        else:
            print("Invalid choice. Please try again.")

def record_and_match(api, db_manager, voice_matcher, matcher_db_path):
    """Record a voice sample and match it against the database"""
    # Record voice
    print("Press Enter to start recording...")
    input()
    
    success, message = api.start_recording(duration=5)  # Record for 5 seconds
    if success:
        print(message)
        print("Recording for 5 seconds...")
        
        # Wait for recording to finish
        import time
        time.sleep(6)
        
        # Stop recording
        success, file_path = api.stop_recording()
        if success:
            print(f"Recording saved to: {file_path}")
            
            # Match the recording against the database
            print("\nMatching recording against the database...")
            matches = api.match_recording(threshold=0.6, limit=5)
            
            if matches:
                print("\nMatches found:")
                for i, (sample_id, similarity) in enumerate(matches):
                    print(f"{i+1}. Sample ID: {sample_id}, Similarity: {similarity:.4f}")
                    
                    # Get metadata
                    metadata = db_manager.get_sample_metadata(sample_id)
                    if metadata:
                        print(f"   Metadata: {metadata}")
            else:
                print("\nNo matches found in the database.")
                
            # Ask if the user wants to add the recording to the database
            save = input("\nDo you want to add this recording to the database? (y/n): ")
            if save.lower() == 'y':
                # Get metadata
                name = input("Enter a name for this voice sample: ")
                metadata = {
                    "name": name,
                    "date_recorded": time.strftime("%Y-%m-%d %H:%M:%S"),
                    "source": "example_script"
                }
                
                # Add to database
                success, sample_id = api.add_recording_to_database(metadata=metadata)
                if success:
                    print(f"Added to database with ID: {sample_id}")
                    
                    # Save the matcher database
                    voice_matcher.save_database(matcher_db_path)
                    print("Saved matcher database")
                else:
                    print(f"Failed to add to database: {sample_id}")
        else:
            print(f"Failed to stop recording: {file_path}")
    else:
        print(f"Failed to start recording: {message}")

def view_stored_records(db_manager):
    """View all stored voice records and play them"""
    # Try to initialize pygame for audio playback
    try:
        import pygame
        pygame.mixer.init()
        audio_available = True
    except ImportError:
        print("Warning: pygame not installed. Audio playback will not be available.")
        audio_available = False
    except Exception as e:
        print(f"Warning: Could not initialize audio system: {e}")
        audio_available = False
    
    # Get all samples
    samples = db_manager.get_all_samples()
    
    if not samples:
        print("No voice samples found in the database.")
        return
    
    print(f"\nFound {len(samples)} voice samples:")
    
    # Display all samples
    for i, sample in enumerate(samples):
        sample_id = sample['sample_id']
        file_path = sample.get('file_path', 'Unknown')
        date_added = sample.get('date_added', 'Unknown')
        
        # Get metadata
        metadata = db_manager.get_sample_metadata(sample_id)
        name = metadata.get('name', '')
        
        # Display sample info
        print(f"{i+1}. ID: {sample_id}")
        print(f"   Name: {name}")
        print(f"   Date Added: {date_added}")
        print(f"   File: {file_path}")
        
        if metadata:
            print("   Additional Metadata:")
            for key, value in metadata.items():
                if key != 'name':  # Already displayed name
                    print(f"      {key}: {value}")
        
        print("")
    
    while True:
        print("\nOptions:")
        print("1. Play a voice sample")
        print("2. Return to main menu")
        
        option = input("Enter your choice (1-2): ")
        
        if option == '1':
            if not audio_available:
                print("Audio playback is not available. Please install pygame.")
                continue
                
            # Ask which sample to play
            sample_num = input(f"Enter sample number to play (1-{len(samples)}): ")
            try:
                sample_num = int(sample_num)
                if 1 <= sample_num <= len(samples):
                    # Get the sample
                    sample = samples[sample_num - 1]
                    file_path = sample.get('file_path')
                    
                    if not file_path or not os.path.exists(file_path):
                        print(f"Error: File not found: {file_path}")
                        continue
                    
                    # Play the audio
                    print(f"Playing sample: {sample['sample_id']}...")
                    
                    # Stop any currently playing audio
                    pygame.mixer.music.stop()
                    
                    # Load and play
                    pygame.mixer.music.load(file_path)
                    pygame.mixer.music.play()
                    
                    # Wait for audio to finish or user to stop
                    print("Press Enter to stop playback or wait for it to finish...")
                    try:
                        import threading
                        import time
                        
                        # Create a thread to check if the music is still playing
                        class PlaybackThread(threading.Thread):
                            def __init__(self):
                                super().__init__()
                                self.daemon = True
                                self.stopped = False
                                
                            def run(self):
                                while pygame.mixer.music.get_busy() and not self.stopped:
                                    time.sleep(0.1)
                                
                                if not self.stopped:
                                    print("Playback finished.")
                        
                        # Start the thread
                        playback_thread = PlaybackThread()
                        playback_thread.start()
                        
                        # Wait for user input or for the thread to finish
                        input()
                        
                        # Stop playback and thread
                        pygame.mixer.music.stop()
                        playback_thread.stopped = True
                        
                    except KeyboardInterrupt:
                        pygame.mixer.music.stop()
                        print("Playback stopped.")
                        
                else:
                    print("Invalid sample number.")
            except ValueError:
                print("Please enter a valid number.")
        elif option == '2':
            break
        else:
            print("Invalid option. Please try again.")

if __name__ == "__main__":
    main()
