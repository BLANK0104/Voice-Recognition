import requests
import json
import os
from flask import Flask, request, jsonify
from flask_restful import Api, Resource
import threading
from pathlib import Path
import time
import wave
import datetime

# Voice recording requirements
try:
    import pyaudio
    PYAUDIO_AVAILABLE = True
except ImportError:
    PYAUDIO_AVAILABLE = False
    print("PyAudio not available. Voice recording will be disabled.")

class VoiceRecognitionAPI:
    def __init__(self, db_manager, voice_processor, matcher):
        self.db_manager = db_manager
        self.voice_processor = voice_processor
        self.matcher = matcher
        self.api_app = None
        self.server_thread = None
        
        # Voice recording properties
        self.recording = False
        self.frames = []
        self.recording_thread = None
        self.record_path = None
        self.audio_format = pyaudio.paInt16 if PYAUDIO_AVAILABLE else None
        self.channels = 1  # Mono recording
        self.rate = 16000  # Sample rate (Hz)
        self.chunk = 1024  # Record in chunks
        self.pyaudio_instance = None
        
    def import_metadata_from_api(self, api_url, sample_id, api_key=None):
        """Import metadata for a voice sample from an external API"""
        headers = {}
        if api_key:
            headers['Authorization'] = f'Bearer {api_key}'
        
        try:
            response = requests.get(f"{api_url}/samples/{sample_id}", headers=headers)
            if response.status_code == 200:
                metadata = response.json()
                # Store the metadata in the database
                self.db_manager.update_sample_metadata(sample_id, metadata)
                return True, metadata
            else:
                return False, f"API returned error: {response.status_code}"
        except Exception as e:
            return False, f"Error communicating with API: {str(e)}"
    
    def export_matches_to_api(self, api_url, matches, api_key=None):
        """Export match results to an external API"""
        headers = {
            'Content-Type': 'application/json'
        }
        if api_key:
            headers['Authorization'] = f'Bearer {api_key}'
        
        try:
            payload = {
                'matches': matches,
                'timestamp': self._get_timestamp()
            }
            
            response = requests.post(f"{api_url}/matches", 
                                     headers=headers,
                                     data=json.dumps(payload))
            
            if response.status_code in (200, 201):
                return True, response.json()
            else:
                return False, f"API returned error: {response.status_code}"
        except Exception as e:
            return False, f"Error sending data to API: {str(e)}"
    
    def _get_timestamp(self):
        """Get current timestamp in ISO format"""
        from datetime import datetime
        return datetime.now().isoformat()
    
    def start_recording(self, output_path=None, duration=None):
        """
        Start recording voice from the microphone
        
        Args:
            output_path: Path to save the recording. If None, a default path is used.
            duration: Maximum recording duration in seconds. If None, records until stop_recording is called.
            
        Returns:
            Tuple of (success, message)
        """
        if not PYAUDIO_AVAILABLE:
            return False, "PyAudio is not installed. Cannot record audio."
            
        if self.recording:
            return False, "Recording is already in progress."
            
        # Create default output path if not provided
        if output_path is None:
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            output_dir = Path("data") / "recordings"
            os.makedirs(output_dir, exist_ok=True)
            output_path = output_dir / f"recording_{timestamp}.wav"
            
        self.record_path = str(output_path)
        self.frames = []
        self.recording = True
        
        # Start recording in a separate thread
        self.recording_thread = threading.Thread(
            target=self._record_audio,
            kwargs={'duration': duration}
        )
        self.recording_thread.daemon = True
        self.recording_thread.start()
        
        return True, f"Recording started. Output will be saved to {output_path}"
    
    def stop_recording(self):
        """
        Stop the recording and save the file
        
        Returns:
            Tuple of (success, file_path)
        """
        if not self.recording:
            return False, "No recording in progress."
            
        self.recording = False
        
        # Wait for recording thread to finish
        if self.recording_thread:
            self.recording_thread.join(timeout=2)
            
        # File should be saved by the recording thread
        if os.path.exists(self.record_path):
            return True, self.record_path
        else:
            return False, "Failed to save recording."
    
    def _record_audio(self, duration=None):
        """
        Record audio from the microphone
        
        Args:
            duration: Maximum recording duration in seconds. If None, records until self.recording is False.
        """
        try:
            p = pyaudio.PyAudio()
            self.pyaudio_instance = p
            
            stream = p.open(
                format=self.audio_format,
                channels=self.channels,
                rate=self.rate,
                input=True,
                frames_per_buffer=self.chunk
            )
            
            print("* Recording started")
            
            # Record for the specified duration or until stopped
            start_time = time.time()
            while self.recording:
                data = stream.read(self.chunk)
                self.frames.append(data)
                
                # Check if duration limit reached
                if duration is not None and (time.time() - start_time) > duration:
                    self.recording = False
                    break
            
            print("* Recording finished")
            
            # Stop and close the stream
            stream.stop_stream()
            stream.close()
            p.terminate()
            
            # Save the recorded data as a WAV file
            self._save_recording()
            
        except Exception as e:
            print(f"Error during recording: {e}")
            self.recording = False
    
    def _save_recording(self):
        """Save the recorded data to a WAV file"""
        try:
            wf = wave.open(self.record_path, 'wb')
            wf.setnchannels(self.channels)
            wf.setsampwidth(self.pyaudio_instance.get_sample_size(self.audio_format))
            wf.setframerate(self.rate)
            wf.writeframes(b''.join(self.frames))
            wf.close()
            print(f"Recording saved to {self.record_path}")
        except Exception as e:
            print(f"Error saving recording: {e}")
            
    def process_recording(self, recording_path=None):
        """
        Process a recorded voice sample
        
        Args:
            recording_path: Path to the recording file. If None, uses the last recording.
            
        Returns:
            Tuple of (sample_id, processed_path)
        """
        if recording_path is None:
            recording_path = self.record_path
            
        if not recording_path or not os.path.exists(recording_path):
            return None, "Recording file not found."
            
        # Generate a sample ID from the filename
        sample_id = Path(recording_path).stem
        
        # Process the recording
        output_dir = Path("data") / "processed"
        os.makedirs(output_dir, exist_ok=True)
        processed_path = output_dir / f"{sample_id}_processed.wav"
        
        processed_file = self.voice_processor.process_sample(
            recording_path,
            str(processed_path)
        )
        
        return sample_id, processed_file
    
    def match_recording(self, recording_path=None, threshold=0.7, limit=10):
        """
        Match a recorded voice against the database
        
        Args:
            recording_path: Path to the recording file. If None, uses the last recording.
            threshold: Similarity threshold for matches
            limit: Maximum number of matches to return
            
        Returns:
            List of matches (sample_id, similarity score)
        """
        # Process the recording if not already processed
        sample_id, processed_path = self.process_recording(recording_path)
        
        if not processed_path or processed_path == "Recording file not found.":
            return []
        
        # Extract voice fingerprint
        fingerprint = self.voice_processor.extract_voice_fingerprint(processed_path)
        
        # Find matches
        matches = self.matcher.find_matches(fingerprint, threshold=threshold, limit=limit)
        
        return matches
    
    def add_recording_to_database(self, recording_path=None, metadata=None):
        """
        Add a recorded voice sample to the database
        
        Args:
            recording_path: Path to the recording file. If None, uses the last recording.
            metadata: Additional metadata for the sample
            
        Returns:
            Tuple of (success, sample_id)
        """
        # Process the recording if not already processed
        sample_id, processed_path = self.process_recording(recording_path)
        
        if not processed_path or processed_path == "Recording file not found.":
            return False, "Recording file not found."
        
        if recording_path is None:
            recording_path = self.record_path
            
        # Add to database
        success = self.db_manager.add_voice_sample(
            sample_id,
            recording_path,
            processed_path,
            metadata
        )
        
        if success:
            # Extract features for the matcher
            features = self.voice_processor.extract_voice_fingerprint(processed_path)
            
            # Add to matcher
            self.matcher.add_fingerprint(sample_id, features, metadata)
            
            return True, sample_id
        else:
            return False, "Failed to add sample to database."
    
    def start_api_server(self, host='0.0.0.0', port=5000):
        """Start a REST API server to provide voice recognition services"""
        app = Flask("VoiceRecognitionAPI")
        api = Api(app)
        self.api_app = app
        
        class SampleList(Resource):
            def get(self_resource):
                samples = self.db_manager.get_all_samples()
                return jsonify(samples)
            
            def post(self_resource):
                # Handle file uploads
                if 'file' not in request.files:
                    return {'error': 'No file provided'}, 400
                
                file = request.files['file']
                metadata = json.loads(request.form.get('metadata', '{}'))
                
                # Save the file
                upload_dir = Path("data") / "samples"
                os.makedirs(upload_dir, exist_ok=True)
                file_path = upload_dir / file.filename
                file.save(file_path)
                
                # Process the file
                processed_path = self.voice_processor.process_sample(
                    str(file_path), 
                    str(Path("data") / "processed" / file.filename)
                )
                
                # Add to database
                sample_id = os.path.splitext(file.filename)[0]
                success = self.db_manager.add_voice_sample(
                    sample_id, 
                    str(file_path), 
                    str(processed_path), 
                    metadata
                )
                
                if success:
                    return {'sample_id': sample_id, 'status': 'success'}, 201
                else:
                    return {'error': 'Failed to add sample'}, 500
        
        class SampleDetail(Resource):
            def get(self_resource, sample_id):
                sample = self.db_manager.get_voice_sample(sample_id)
                if sample:
                    metadata = self.db_manager.get_sample_metadata(sample_id)
                    sample['metadata'] = metadata
                    return jsonify(sample)
                return {'error': 'Sample not found'}, 404
        
        class MatchSample(Resource):
            def post(self_resource):
                if 'file' not in request.files:
                    return {'error': 'No file provided'}, 400
                
                file = request.files['file']
                threshold = float(request.form.get('threshold', 0.7))
                limit = int(request.form.get('limit', 10))
                
                # Save the file temporarily
                temp_path = Path("data") / "temp" / file.filename
                os.makedirs(temp_path.parent, exist_ok=True)
                file.save(temp_path)
                
                # Process and extract features
                processed_path = self.voice_processor.process_sample(
                    str(temp_path), 
                    str(Path("data") / "temp" / f"proc_{file.filename}")
                )
                
                # Extract fingerprint
                fingerprint = self.voice_processor.extract_voice_fingerprint(processed_path)
                
                # Find matches
                matches = self.matcher.find_matches(fingerprint, threshold, limit=limit)
                
                # Format results
                results = []
                for sample_id, similarity in matches:
                    sample = self.db_manager.get_voice_sample(sample_id)
                    metadata = self.db_manager.get_sample_metadata(sample_id)
                    results.append({
                        'sample_id': sample_id,
                        'similarity': float(similarity),
                        'metadata': metadata
                    })
                
                # Clean up temp files
                try:
                    os.remove(temp_path)
                    os.remove(processed_path)
                except:
                    pass
                
                return jsonify({'matches': results})
        
        class RecordVoice(Resource):
            def post(self_resource):
                # Get parameters
                duration = request.form.get('duration', None)
                if duration:
                    duration = float(duration)
                
                # Start recording
                success, message = self.start_recording(duration=duration)
                
                if success:
                    return {'status': 'recording', 'message': message}, 200
                else:
                    return {'error': message}, 400
            
            def delete(self_resource):
                # Stop recording
                success, file_path = self.stop_recording()
                
                if success:
                    return {'status': 'stopped', 'file_path': file_path}, 200
                else:
                    return {'error': file_path}, 400
        
        class MatchRecording(Resource):
            def post(self_resource):
                # Stop recording if it's still going
                if self.recording:
                    self.stop_recording()
                
                # Get parameters
                threshold = float(request.form.get('threshold', 0.7))
                limit = int(request.form.get('limit', 10))
                
                # Match the recording
                matches = self.match_recording(threshold=threshold, limit=limit)
                
                # Format results
                results = []
                for sample_id, similarity in matches:
                    sample = self.db_manager.get_voice_sample(sample_id)
                    metadata = self.db_manager.get_sample_metadata(sample_id)
                    results.append({
                        'sample_id': sample_id,
                        'similarity': float(similarity),
                        'metadata': metadata
                    })
                
                return jsonify({'matches': results})
        
        class SaveRecording(Resource):
            def post(self_resource):
                # Get parameters
                metadata = json.loads(request.form.get('metadata', '{}'))
                
                # Add to database
                success, sample_id = self.add_recording_to_database(metadata=metadata)
                
                if success:
                    return {'sample_id': sample_id, 'status': 'success'}, 201
                else:
                    return {'error': sample_id}, 500
        
        # Register additional endpoints
        api.add_resource(RecordVoice, '/api/record')
        api.add_resource(MatchRecording, '/api/record/match')
        api.add_resource(SaveRecording, '/api/record/save')
        
        # Register existing endpoints
        api.add_resource(SampleList, '/api/samples')
        api.add_resource(SampleDetail, '/api/samples/<string:sample_id>')
        api.add_resource(MatchSample, '/api/match')
        
        # Start the server in a separate thread
        self.server_thread = threading.Thread(
            target=app.run, 
            kwargs={'host': host, 'port': port}
        )
        self.server_thread.daemon = True
        self.server_thread.start()
        
        return app
    
    def stop_api_server(self):
        """Stop the API server"""
        if self.server_thread and self.server_thread.is_alive():
            # This is a bit of a hack but works for development
            import os
            import signal
            os.kill(os.getpid(), signal.SIGINT)
            self.server_thread.join(timeout=5)
            return True
        return False
