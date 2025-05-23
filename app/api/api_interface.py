import requests
import json
import os
from flask import Flask, request, jsonify
from flask_restful import Api, Resource
import threading
from pathlib import Path

class VoiceRecognitionAPI:
    def __init__(self, db_manager, voice_processor, matcher):
        self.db_manager = db_manager
        self.voice_processor = voice_processor
        self.matcher = matcher
        self.api_app = None
        self.server_thread = None
        
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
        
        # Register endpoints
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
