import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import os
import threading
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from pathlib import Path
import sys
import time
import json

# Add parent directory to path to enable imports
sys.path.append(str(Path(__file__).parent.parent.parent))

# Import our modules
from app.voice_processing.noise_reduction import NoiseReducer
from app.feature_extraction.voice_features import VoiceFeatureExtractor
from app.matching_engine.voice_matcher import VoiceMatcher
from app.database.voice_db import VoiceDatabase
from app.api.api_interface import VoiceRecognitionAPI

class VRSDashboard:
    def __init__(self, root):
        self.root = root
        self.root.title("Voice Recognition System for Cyber Fraud Investigation")
        self.root.geometry("1200x800")
        
        # Initialize components
        try:
            db_path = Path("data") / "voice_recognition.db"
            self.db_manager = VoiceDatabase(str(db_path))
            self.voice_processor = NoiseReducer()
            self.feature_extractor = VoiceFeatureExtractor()
            self.voice_matcher = VoiceMatcher()
            self.api_interface = VoiceRecognitionAPI(
                self.db_manager, 
                self.voice_processor,
                self.voice_matcher
            )
        except Exception as e:
            self.show_error(f"Error initializing components: {str(e)}")
            return
            
        # Set up the main frame
        self.main_frame = ttk.Frame(root)
        self.main_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # Create a simple label for now
        ttk.Label(
            self.main_frame, 
            text="Voice Recognition System is initializing...",
            font=("Arial", 16)
        ).pack(pady=20)
        
        # Create a basic interface with a button to test functionality
        self.test_button = ttk.Button(
            self.main_frame, 
            text="Load Sample",
            command=self.load_sample
        )
        self.test_button.pack(pady=10)
        
        # Status bar
        self.status_var = tk.StringVar(value="Ready")
        self.status_bar = ttk.Label(
            root, 
            textvariable=self.status_var,
            relief=tk.SUNKEN, 
            anchor=tk.W
        )
        self.status_bar.pack(side=tk.BOTTOM, fill=tk.X)
        
        # Schedule full UI initialization for later (to show the window faster)
        self.root.after(100, self.initialize_full_ui)
    
    def initialize_full_ui(self):
        """Initialize the full UI components"""
        self.status_var.set("Initializing interface...")
        
        # Clear the main frame
        for widget in self.main_frame.winfo_children():
            widget.destroy()
        
        # Here we would create the full interface with tabs, etc.
        # For now, let's keep a simple placeholder
        ttk.Label(
            self.main_frame, 
            text="Voice Recognition System Dashboard",
            font=("Arial", 16)
        ).pack(pady=20)
        
        # Add a frame for basic actions
        actions_frame = ttk.LabelFrame(self.main_frame, text="Actions")
        actions_frame.pack(fill=tk.X, padx=10, pady=10)
        
        # Add some buttons
        ttk.Button(
            actions_frame, 
            text="Add Voice Sample",
            command=self.load_sample
        ).grid(row=0, column=0, padx=10, pady=10)
        
        ttk.Button(
            actions_frame, 
            text="Match Voice Sample",
            command=self.match_sample
        ).grid(row=0, column=1, padx=10, pady=10)
        
        ttk.Button(
            actions_frame, 
            text="Start API Server",
            command=self.toggle_api_server
        ).grid(row=0, column=2, padx=10, pady=10)
        
        self.status_var.set("Ready")
    
    def load_sample(self):
        """Load and process a voice sample"""
        file_path = filedialog.askopenfilename(
            title="Select Voice Sample",
            filetypes=[("Audio Files", "*.wav *.mp3 *.ogg")]
        )
        
        if not file_path:
            return
            
        try:
            # Update status
            self.status_var.set(f"Processing file: {os.path.basename(file_path)}")
            self.root.update()
            
            # Generate a sample ID from the filename
            sample_id = os.path.splitext(os.path.basename(file_path))[0]
            
            # Create sample metadata dialog
            metadata = self.get_sample_metadata(sample_id)
            if metadata is None:  # User cancelled
                self.status_var.set("Sample processing cancelled")
                return
                
            # Process the audio file
            output_dir = Path("data") / "processed"
            os.makedirs(output_dir, exist_ok=True)
            output_file = output_dir / f"{sample_id}_processed.wav"
            
            self.status_var.set("Applying noise reduction and enhancement...")
            self.root.update()
            
            processed_path = self.voice_processor.process_sample(
                file_path, 
                str(output_file)
            )
            
            if not processed_path:
                messagebox.showerror("Processing Error", "Failed to process the audio file")
                self.status_var.set("Error processing sample")
                return
                
            # Extract features
            self.status_var.set("Extracting voice features...")
            self.root.update()
            
            features = self.feature_extractor.extract_voice_fingerprint(processed_path)
            
            # Add to database
            self.status_var.set("Adding to database...")
            self.root.update()
            
            success = self.db_manager.add_voice_sample(
                sample_id,
                file_path,
                processed_path,
                metadata
            )
            
            if not success:
                messagebox.showerror("Database Error", "Failed to add sample to database")
                self.status_var.set("Error adding sample to database")
                return
                
            # Add to matcher
            self.voice_matcher.add_fingerprint(sample_id, features, metadata)
            
            # Save the matcher database
            matcher_db_path = Path("data") / "matcher_database.pkl"
            self.voice_matcher.save_database(matcher_db_path)
            
            # Display success
            messagebox.showinfo("Success", 
                f"Sample {sample_id} processed and added to database successfully")
            
            # Visualize the processing results
            self.visualize_processing_results(file_path, processed_path)
            
            self.status_var.set(f"Sample {sample_id} added successfully")
            
        except Exception as e:
            messagebox.showerror("Error", f"An error occurred: {str(e)}")
            self.status_var.set(f"Error: {str(e)}")
    
    def get_sample_metadata(self, sample_id):
        """Show dialog to collect metadata for a sample"""
        metadata_dialog = tk.Toplevel(self.root)
        metadata_dialog.title("Sample Metadata")
        metadata_dialog.geometry("400x300")
        metadata_dialog.transient(self.root)
        metadata_dialog.grab_set()
        
        # Configure dialog
        metadata_dialog.grid_columnconfigure(1, weight=1)
        
        # Sample ID (non-editable)
        ttk.Label(metadata_dialog, text="Sample ID:").grid(row=0, column=0, sticky=tk.W, padx=5, pady=5)
        ttk.Label(metadata_dialog, text=sample_id).grid(row=0, column=1, sticky=tk.W, padx=5, pady=5)
        
        # Fields for metadata
        fields = [
            ("Name", ""),
            ("Case ID", ""),
            ("Date Recorded", ""),
            ("Location", ""),
            ("Notes", "")
        ]
        
        field_vars = {}
        for i, (field, default) in enumerate(fields):
            ttk.Label(metadata_dialog, text=f"{field}:").grid(row=i+1, column=0, sticky=tk.W, padx=5, pady=5)
            
            var = tk.StringVar(value=default)
            field_vars[field] = var
            
            entry = ttk.Entry(metadata_dialog, textvariable=var, width=30)
            entry.grid(row=i+1, column=1, sticky=tk.EW, padx=5, pady=5)
        
        # Fraud indicator
        fraud_var = tk.BooleanVar(value=False)
        fraud_check = ttk.Checkbutton(metadata_dialog, text="Known Fraudster", variable=fraud_var)
        fraud_check.grid(row=len(fields)+1, column=0, columnspan=2, sticky=tk.W, padx=5, pady=5)
        
        # Result storage
        result = [None]  # Using list to store result from inner function
        
        def on_ok():
            metadata = {field: var.get() for field, var in field_vars.items()}
            metadata["is_fraudster"] = fraud_var.get()
            metadata["date_added"] = time.strftime("%Y-%m-%d %H:%M:%S")
            result[0] = metadata
            metadata_dialog.destroy()
            
        def on_cancel():
            metadata_dialog.destroy()
        
        # Buttons
        btn_frame = ttk.Frame(metadata_dialog)
        btn_frame.grid(row=len(fields)+2, column=0, columnspan=2, pady=10)
        
        ttk.Button(btn_frame, text="OK", command=on_ok).pack(side=tk.LEFT, padx=5)
        ttk.Button(btn_frame, text="Cancel", command=on_cancel).pack(side=tk.LEFT, padx=5)
        
        # Wait for dialog to close
        self.root.wait_window(metadata_dialog)
        
        return result[0]
    
    def visualize_processing_results(self, original_path, processed_path):
        """Visualize the results of audio processing"""
        # Create dialog
        viz_dialog = tk.Toplevel(self.root)
        viz_dialog.title("Processing Results")
        viz_dialog.geometry("800x600")
        viz_dialog.transient(self.root)
        
        # Create matplotlib figure
        figure = plt.Figure(figsize=(10, 8), dpi=100)
        
        # Original waveform
        ax1 = figure.add_subplot(211)
        try:
            import librosa
            y_orig, sr_orig = librosa.load(original_path, sr=None)
            times_orig = np.arange(len(y_orig)) / sr_orig
            ax1.plot(times_orig, y_orig)
            ax1.set_title("Original Waveform")
            ax1.set_xlabel("Time (s)")
            ax1.set_ylabel("Amplitude")
        except Exception as e:
            ax1.text(0.5, 0.5, f"Error loading original: {str(e)}", 
                    ha='center', va='center')
        
        # Processed waveform
        ax2 = figure.add_subplot(212)
        try:
            y_proc, sr_proc = librosa.load(processed_path, sr=None)
            times_proc = np.arange(len(y_proc)) / sr_proc
            ax2.plot(times_proc, y_proc)
            ax2.set_title("Processed Waveform")
            ax2.set_xlabel("Time (s)")
            ax2.set_ylabel("Amplitude")
        except Exception as e:
            ax2.text(0.5, 0.5, f"Error loading processed: {str(e)}", 
                    ha='center', va='center')
        
        # Add figure to dialog
        figure.tight_layout()
        canvas = FigureCanvasTkAgg(figure, viz_dialog)
        canvas.draw()
        canvas.get_tk_widget().pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # Create button frame
        btn_frame = ttk.Frame(viz_dialog)
        btn_frame.pack(fill=tk.X, padx=10, pady=10)
        
        # Add buttons to play audio
        ttk.Button(
            btn_frame, 
            text="Play Original", 
            command=lambda: self.play_audio_file(original_path)
        ).pack(side=tk.LEFT, padx=5)
        
        ttk.Button(
            btn_frame, 
            text="Play Processed", 
            command=lambda: self.play_audio_file(processed_path)
        ).pack(side=tk.LEFT, padx=5)
        
        ttk.Button(
            btn_frame, 
            text="Close", 
            command=viz_dialog.destroy
        ).pack(side=tk.RIGHT, padx=5)
    
    def match_sample(self):
        """Match a voice sample against the database"""
        # Check if there are samples in the database
        if not self.voice_matcher.fingerprints:
            messagebox.showinfo("No Samples", 
                "There are no voice samples in the database to match against. Please add samples first.")
            return
            
        # Ask user to select a method: file or recording
        method = messagebox.askquestion("Match Method", 
            "Do you want to match with a recorded voice?\n\nSelect 'Yes' to record, 'No' to select a file.")
            
        fingerprint = None
        sample_path = None
            
        if method == 'yes':  # Record voice
            # Create recording dialog
            record_dialog = tk.Toplevel(self.root)
            record_dialog.title("Record Voice")
            record_dialog.geometry("400x200")
            record_dialog.transient(self.root)
            record_dialog.grab_set()
            
            # Status label
            status_var = tk.StringVar(value="Press 'Start Recording' to begin")
            status_label = ttk.Label(record_dialog, textvariable=status_var, font=("Arial", 12))
            status_label.pack(pady=20)
            
            # Recording state
            recording_state = {'recording': False, 'path': None}
            
            # Buttons
            btn_frame = ttk.Frame(record_dialog)
            btn_frame.pack(fill=tk.X, pady=10)
            
            def start_recording():
                try:
                    import pyaudio
                    import wave
                    import threading
                    import time
                    
                    status_var.set("Recording... Speak now")
                    recording_state['recording'] = True
                    
                    # Setup recording parameters
                    chunk = 1024
                    sample_format = pyaudio.paInt16
                    channels = 1
                    fs = 16000
                    
                    # Create output path
                    timestamp = time.strftime("%Y%m%d_%H%M%S")
                    output_dir = Path("data") / "recordings"
                    os.makedirs(output_dir, exist_ok=True)
                    output_path = output_dir / f"recording_{timestamp}.wav"
                    recording_state['path'] = str(output_path)
                    
                    # Initialize PyAudio
                    p = pyaudio.PyAudio()
                    
                    # Open stream
                    stream = p.open(format=sample_format,
                                    channels=channels,
                                    rate=fs,
                                    frames_per_buffer=chunk,
                                    input=True)
                    
                    frames = []
                    
                    # Record for 5 seconds
                    def record():
                        try:
                            start_time = time.time()
                            while recording_state['recording'] and (time.time() - start_time) < 10:  # 10 sec max
                                data = stream.read(chunk)
                                frames.append(data)
                                
                            # Stop and close the stream
                            stream.stop_stream()
                            stream.close()
                            p.terminate()
                            
                            # Save the recorded data as a WAV file
                            wf = wave.open(recording_state['path'], 'wb')
                            wf.setnchannels(channels)
                            wf.setsampwidth(p.get_sample_size(sample_format))
                            wf.setframerate(fs)
                            wf.writeframes(b''.join(frames))
                            wf.close()
                            
                            status_var.set(f"Recording saved to {os.path.basename(recording_state['path'])}")
                        except Exception as e:
                            status_var.set(f"Error: {str(e)}")
                    
                    # Start recording in a thread
                    threading.Thread(target=record, daemon=True).start()
                    
                except Exception as e:
                    status_var.set(f"Error: {str(e)}")
                    recording_state['recording'] = False
            
            def stop_recording():
                recording_state['recording'] = False
                status_var.set("Processing recording...")
                
                # Process the recording
                if recording_state['path'] and os.path.exists(recording_state['path']):
                    # Process the file
                    output_dir = Path("data") / "processed"
                    os.makedirs(output_dir, exist_ok=True)
                    
                    filename = os.path.basename(recording_state['path'])
                    sample_id = os.path.splitext(filename)[0]
                    output_file = output_dir / f"{sample_id}_processed.wav"
                    
                    try:
                        processed_path = self.voice_processor.process_sample(
                            recording_state['path'], 
                            str(output_file)
                        )
                        
                        # Extract features
                        nonlocal fingerprint, sample_path
                        fingerprint = self.feature_extractor.extract_voice_fingerprint(processed_path)
                        sample_path = recording_state['path']
                        
                        status_var.set("Recording processed successfully")
                        
                        # Close dialog
                        record_dialog.destroy()
                        
                    except Exception as e:
                        status_var.set(f"Error processing: {str(e)}")
                else:
                    status_var.set("No recording found")
            
            ttk.Button(btn_frame, text="Start Recording", command=start_recording).pack(side=tk.LEFT, padx=10, pady=10)
            ttk.Button(btn_frame, text="Stop & Process", command=stop_recording).pack(side=tk.LEFT, padx=10, pady=10)
            ttk.Button(btn_frame, text="Cancel", command=record_dialog.destroy).pack(side=tk.RIGHT, padx=10, pady=10)
            
            # Wait for dialog to close
            self.root.wait_window(record_dialog)
            
        else:  # Select file
            file_path = filedialog.askopenfilename(
                title="Select Voice Sample to Match",
                filetypes=[("Audio Files", "*.wav *.mp3 *.ogg")]
            )
            
            if not file_path:
                return
                
            try:
                # Process the file
                output_dir = Path("data") / "temp"
                os.makedirs(output_dir, exist_ok=True)
                
                filename = os.path.basename(file_path)
                sample_id = os.path.splitext(filename)[0]
                output_file = output_dir / f"{sample_id}_processed.wav"
                
                self.status_var.set("Processing sample for matching...")
                self.root.update()
                
                processed_path = self.voice_processor.process_sample(
                    file_path, 
                    str(output_file)
                )
                
                # Extract features
                self.status_var.set("Extracting voice features...")
                self.root.update()
                
                fingerprint = self.feature_extractor.extract_voice_fingerprint(processed_path)
                sample_path = file_path
                
            except Exception as e:
                messagebox.showerror("Error", f"Error processing sample: {str(e)}")
                self.status_var.set(f"Error: {str(e)}")
                return
        
        # If we have a fingerprint, find matches
        if fingerprint is not None:
            self.status_var.set("Finding matches...")
            self.root.update()
            
            # Create match settings dialog
            settings_dialog = tk.Toplevel(self.root)
            settings_dialog.title("Match Settings")
            settings_dialog.geometry("300x200")
            settings_dialog.transient(self.root)
            settings_dialog.grab_set()
            
            # Settings
            ttk.Label(settings_dialog, text="Similarity Threshold:").grid(row=0, column=0, sticky=tk.W, padx=5, pady=5)
            threshold_var = tk.DoubleVar(value=0.7)
            threshold_slider = ttk.Scale(settings_dialog, from_=0.0, to=1.0, orient=tk.HORIZONTAL, 
                                       variable=threshold_var, length=150)
            threshold_slider.grid(row=0, column=1, sticky=tk.EW, padx=5, pady=5)
            ttk.Label(settings_dialog, textvariable=threshold_var).grid(row=0, column=2, padx=5, pady=5)
            
            ttk.Label(settings_dialog, text="Maximum Results:").grid(row=1, column=0, sticky=tk.W, padx=5, pady=5)
            limit_var = tk.IntVar(value=5)
            limit_spinbox = ttk.Spinbox(settings_dialog, from_=1, to=20, textvariable=limit_var, width=5)
            limit_spinbox.grid(row=1, column=1, sticky=tk.W, padx=5, pady=5)
            
            ttk.Label(settings_dialog, text="Include Fraudsters:").grid(row=2, column=0, sticky=tk.W, padx=5, pady=5)
            include_fraudsters_var = tk.BooleanVar(value=True)
            include_fraudsters_check = ttk.Checkbutton(settings_dialog, variable=include_fraudsters_var)
            include_fraudsters_check.grid(row=2, column=1, sticky=tk.W, padx=5, pady=5)
            
            # Store result
            result = [None]
            
            def on_find():
                result[0] = {
                    'threshold': threshold_var.get(),
                    'limit': limit_var.get(),
                    'include_fraudsters': include_fraudsters_var.get()
                }
                settings_dialog.destroy()
                
            # Buttons
            btn_frame = ttk.Frame(settings_dialog)
            btn_frame.grid(row=3, column=0, columnspan=3, pady=20)
            
            ttk.Button(btn_frame, text="Find Matches", command=on_find).pack(side=tk.LEFT, padx=5)
            ttk.Button(btn_frame, text="Cancel", command=settings_dialog.destroy).pack(side=tk.LEFT, padx=5)
            
            # Wait for dialog to close
            self.root.wait_window(settings_dialog)
            
            # If settings provided, find matches
            if result[0] is not None:
                settings = result[0]
                
                # Find matches
                matches = self.voice_matcher.find_matches(
                    fingerprint, 
                    threshold=settings['threshold'], 
                    limit=settings['limit']
                )
                
                # If include fraudsters checked, also check for fraud probability
                fraud_probability = None
                manipulation_score = None
                if settings['include_fraudsters']:
                    # Check if the voice matcher has the fraud detection methods
                    if hasattr(self.voice_matcher, 'calculate_fraud_probability'):
                        fraud_probability, confidence = self.voice_matcher.calculate_fraud_probability(
                            fingerprint, threshold=settings['threshold']
                        )
                    
                    # Check for voice manipulation
                    if hasattr(self.voice_matcher, 'detect_voice_manipulation'):
                        manipulation_score, manipulation_confidence = self.voice_matcher.detect_voice_manipulation(
                            fingerprint
                        )
                
                # Display results
                self.display_match_results(matches, sample_path, fraud_probability, manipulation_score)
                
                self.status_var.set("Matching complete")
            else:
                self.status_var.set("Matching cancelled")
        else:
            self.status_var.set("No valid fingerprint obtained")
    
    def display_match_results(self, matches, sample_path, fraud_probability=None, manipulation_score=None):
        """Display the results of voice matching"""
        # Create results dialog
        results_dialog = tk.Toplevel(self.root)
        results_dialog.title("Match Results")
        results_dialog.geometry("800x600")
        results_dialog.transient(self.root)
        
        # Main frame
        main_frame = ttk.Frame(results_dialog)
        main_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # Original sample frame
        sample_frame = ttk.LabelFrame(main_frame, text="Test Sample")
        sample_frame.pack(fill=tk.X, padx=5, pady=5)
        
        ttk.Label(sample_frame, text=f"File: {os.path.basename(sample_path)}").pack(anchor=tk.W, padx=5, pady=2)
        
        # Play button for original
        ttk.Button(
            sample_frame, 
            text="Play Sample", 
            command=lambda: self.play_audio_file(sample_path)
        ).pack(anchor=tk.W, padx=5, pady=5)
        
        # Fraud analysis frame
        if fraud_probability is not None or manipulation_score is not None:
            fraud_frame = ttk.LabelFrame(main_frame, text="Fraud Analysis")
            fraud_frame.pack(fill=tk.X, padx=5, pady=5)
            
            if fraud_probability is not None:
                fraud_text = f"Fraud Probability: {fraud_probability:.2%}"
                if fraud_probability > 0.7:
                    fraud_text += " - HIGH RISK"
                elif fraud_probability > 0.4:
                    fraud_text += " - MODERATE RISK"
                else:
                    fraud_text += " - LOW RISK"
                    
                fraud_label = ttk.Label(fraud_frame, text=fraud_text)
                if fraud_probability > 0.7:
                    fraud_label.configure(foreground="red")
                elif fraud_probability > 0.4:
                    fraud_label.configure(foreground="orange")
                fraud_label.pack(anchor=tk.W, padx=5, pady=2)
            
            if manipulation_score is not None:
                manip_text = f"Voice Manipulation Detected: {manipulation_score:.2%}"
                if manipulation_score > 0.7:
                    manip_text += " - HIGH PROBABILITY"
                elif manipulation_score > 0.4:
                    manip_text += " - MODERATE PROBABILITY"
                else:
                    manip_text += " - LOW PROBABILITY"
                    
                manip_label = ttk.Label(fraud_frame, text=manip_text)
                if manipulation_score > 0.7:
                    manip_label.configure(foreground="red")
                elif manipulation_score > 0.4:
                    manip_label.configure(foreground="orange")
                manip_label.pack(anchor=tk.W, padx=5, pady=2)
        
        # Matches frame
        matches_frame = ttk.LabelFrame(main_frame, text="Matches")
        matches_frame.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        # Matches treeview
        columns = ("ID", "Similarity", "Name", "Status")
        matches_tree = ttk.Treeview(matches_frame, columns=columns, show="headings")
        
        # Configure columns
        matches_tree.heading("ID", text="Sample ID")
        matches_tree.heading("Similarity", text="Similarity")
        matches_tree.heading("Name", text="Name")
        matches_tree.heading("Status", text="Status")
        
        matches_tree.column("ID", width=150)
        matches_tree.column("Similarity", width=100)
        matches_tree.column("Name", width=200)
        matches_tree.column("Status", width=150)
        
        matches_tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        
        # Scrollbar
        scrollbar = ttk.Scrollbar(matches_frame, orient=tk.VERTICAL, command=matches_tree.yview)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        matches_tree.configure(yscrollcommand=scrollbar.set)
        
        # Add matches to treeview
        for sample_id, similarity in matches:
            # Get sample metadata
            metadata = self.db_manager.get_sample_metadata(sample_id)
            name = metadata.get("Name", "Unknown")
            
            # Determine status
            status = "Normal"
            if metadata.get("is_fraudster", False):
                status = "FRAUDSTER"
            
            # Format similarity as percentage
            similarity_str = f"{similarity:.2%}"
            
            # Add to treeview
            item_id = matches_tree.insert("", "end", values=(sample_id, similarity_str, name, status))
            
            # Color code based on similarity and status
            if status == "FRAUDSTER":
                matches_tree.tag_configure("fraudster", foreground="red")
                matches_tree.item(item_id, tags=("fraudster",))
            elif similarity > 0.9:
                matches_tree.tag_configure("high_match", foreground="green")
                matches_tree.item(item_id, tags=("high_match",))
        
        # Details frame
        details_frame = ttk.LabelFrame(main_frame, text="Match Details")
        details_frame.pack(fill=tk.X, padx=5, pady=5)
        
        # Details text area
        details_text = tk.Text(details_frame, height=6, wrap=tk.WORD)
        details_text.pack(fill=tk.BOTH, padx=5, pady=5)
        details_text.insert("1.0", "Select a match to view details")
        details_text.config(state=tk.DISABLED)
        
        # Function to handle selection
        def on_match_select(event):
            selected_items = matches_tree.selection()
            if not selected_items:
                return
                
            # Get the selected match
            item_id = selected_items[0]
            values = matches_tree.item(item_id, "values")
            
            sample_id = values[0]
            similarity = values[1]
            
            # Get sample metadata
            metadata = self.db_manager.get_sample_metadata(sample_id)
            
            # Get sample details
            sample = self.db_manager.get_voice_sample(sample_id)
            
            # Update details text
            details_text.config(state=tk.NORMAL)
            details_text.delete("1.0", tk.END)
            
            details = f"Sample ID: {sample_id}\n"
            details += f"Similarity: {similarity}\n"
            details += f"File Path: {sample.get('file_path', 'Unknown')}\n"
            details += f"Date Added: {sample.get('date_added', 'Unknown')}\n\n"
            
            if metadata:
                details += "Metadata:\n"
                for key, value in metadata.items():
                    details += f"  {key}: {value}\n"
            
            details_text.insert("1.0", details)
            details_text.config(state=tk.DISABLED)
            
            # Enable play button with the correct path
            play_match_btn.configure(state=tk.NORMAL)
            play_match_btn.configure(command=lambda: self.play_audio_file(sample.get('file_path')))
        
        matches_tree.bind("<<TreeviewSelect>>", on_match_select)
        
        # Buttons
        btn_frame = ttk.Frame(main_frame)
        btn_frame.pack(fill=tk.X, padx=5, pady=10)
        
        play_match_btn = ttk.Button(btn_frame, text="Play Selected Match", state=tk.DISABLED)
        play_match_btn.pack(side=tk.LEFT, padx=5)
        
        export_btn = ttk.Button(
            btn_frame, 
            text="Export Results", 
            command=lambda: self.export_match_results(matches, sample_path)
        )
        export_btn.pack(side=tk.LEFT, padx=5)
        
        ttk.Button(
            btn_frame, 
            text="Close", 
            command=results_dialog.destroy
        ).pack(side=tk.RIGHT, padx=5)
    
    def export_match_results(self, matches, sample_path):
        """Export match results to a file"""
        if not matches:
            messagebox.showinfo("No Results", "There are no results to export.")
            return
            
        # Ask for export format
        formats = [
            ("JSON Files", "*.json"),
            ("CSV Files", "*.csv"),
            ("Text Files", "*.txt")
        ]
        
        file_path = filedialog.asksaveasfilename(
            title="Export Results",
            filetypes=formats,
            defaultextension=".json"
        )
        
        if not file_path:
            return
            
        try:
            # Determine format based on extension
            ext = os.path.splitext(file_path)[1].lower()
            
            if hasattr(self.voice_matcher, 'export_match_report'):
                # Use the built-in export function if available
                if ext == '.json':
                    output = self.voice_matcher.export_match_report(matches, "json", file_path)
                elif ext == '.csv':
                    output = self.voice_matcher.export_match_report(matches, "csv", file_path)
                else:  # Default to text
                    output = self.voice_matcher.export_match_report(matches, "txt", file_path)
                    
                messagebox.showinfo("Export Complete", f"Results exported to {file_path}")
                
            else:
                # Manual export if function not available
                if ext == '.json':
                    # Export as JSON
                    report = {
                        "report_date": time.strftime("%Y-%m-%d %H:%M:%S"),
                        "sample_file": os.path.basename(sample_path),
                        "matches": []
                    }
                    
                    for sample_id, similarity in matches:
                        metadata = self.db_manager.get_sample_metadata(sample_id)
                        sample = self.db_manager.get_voice_sample(sample_id)
                        
                        match_data = {
                            "sample_id": sample_id,
                            "similarity": float(similarity),
                            "metadata": metadata,
                            "file_path": sample.get('file_path', 'Unknown'),
                            "date_added": sample.get('date_added', 'Unknown')
                        }
                        
                        report["matches"].append(match_data)
                    
                    with open(file_path, 'w') as f:
                        json.dump(report, f, indent=2)
                        
                elif ext == '.csv':
                    # Export as CSV
                    import csv
                    
                    with open(file_path, 'w', newline='') as f:
                        writer = csv.writer(f)
                        
                        # Write header
                        writer.writerow(["Sample ID", "Similarity", "Name", "Status", "Date Added"])
                        
                        # Write data
                        for sample_id, similarity in matches:
                            metadata = self.db_manager.get_sample_metadata(sample_id)
                            sample = self.db_manager.get_voice_sample(sample_id)
                            
                            name = metadata.get("Name", "Unknown")
                            status = "FRAUDSTER" if metadata.get("is_fraudster", False) else "Normal"
                            date_added = sample.get('date_added', 'Unknown')
                            
                            writer.writerow([sample_id, similarity, name, status, date_added])
                
                else:  # Default to text
                    # Export as text
                    with open(file_path, 'w') as f:
                        f.write(f"Voice Recognition Match Report\n")
                        f.write(f"Generated: {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
                        f.write(f"Sample File: {os.path.basename(sample_path)}\n")
                        f.write(f"Total Matches: {len(matches)}\n\n")
                        
                        f.write("--- Match Details ---\n\n")
                        
                        for i, (sample_id, similarity) in enumerate(matches):
                            metadata = self.db_manager.get_sample_metadata(sample_id)
                            sample = self.db_manager.get_voice_sample(sample_id)
                            
                            f.write(f"Match #{i+1}:\n")
                            f.write(f"  Sample ID: {sample_id}\n")
                            f.write(f"  Similarity: {similarity:.4f}\n")
                            
                            if metadata.get("is_fraudster", False):
                                f.write(f"  WARNING: KNOWN FRAUDSTER\n")
                            
                            f.write(f"  File Path: {sample.get('file_path', 'Unknown')}\n")
                            f.write(f"  Date Added: {sample.get('date_added', 'Unknown')}\n")
                            
                            f.write("  Metadata:\n")
                            for key, value in metadata.items():
                                f.write(f"    {key}: {value}\n")
                            
                            f.write("\n")
                
                messagebox.showinfo("Export Complete", f"Results exported to {file_path}")
                
        except Exception as e:
            messagebox.showerror("Export Error", f"Error exporting results: {str(e)}")
    
    def play_audio_file(self, file_path):
        """Play an audio file"""
        try:
            import pygame
            
            # Initialize pygame mixer if not already initialized
            if not pygame.mixer.get_init():
                pygame.mixer.init()
            
            # Stop any currently playing audio
            pygame.mixer.music.stop()
            
            # Load and play the audio file
            pygame.mixer.music.load(file_path)
            pygame.mixer.music.play()
            
            self.status_var.set(f"Playing: {os.path.basename(file_path)}")
        except Exception as e:
            messagebox.showerror("Playback Error", f"Error playing audio: {str(e)}")
            self.status_var.set(f"Error: {str(e)}")

def start_application():
    """
    Start the Voice Recognition System application.
    This function initializes the main tkinter window and dashboard.
    """
    root = tk.Tk()
    app = VRSDashboard(root)
    
    # Set window icon if available
    try:
        icon_path = Path(__file__).parent / "resources" / "icon.ico"
        if icon_path.exists():
            root.iconbitmap(str(icon_path))
    except Exception:
        pass  # Continue without icon
    
    # Configure window
    root.protocol("WM_DELETE_WINDOW", lambda: on_closing(root))
    
    # Start the main event loop
    root.mainloop()

def on_closing(root):
    """Handle application closing"""
    if messagebox.askokcancel("Quit", "Do you want to quit the application?"):
        root.destroy()

# If this file is run directly
if __name__ == "__main__":
    start_application()