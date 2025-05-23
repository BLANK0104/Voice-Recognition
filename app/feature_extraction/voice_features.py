import numpy as np
import librosa
import pickle
from pathlib import Path

class VoiceFeatureExtractor:
    """Extracts voice features from audio files, such as MFCC, spectral contrast, and pitch."""
    
    def __init__(self, model_path=None):
        self.sample_rate = 16000
        self.model_path = model_path
        
    def extract_mfcc(self, audio, n_mfcc=13):
        """Extract Mel-frequency cepstral coefficients"""
        mfccs = librosa.feature.mfcc(y=audio, sr=self.sample_rate, n_mfcc=n_mfcc)
        return mfccs
    
    def extract_spectral_contrast(self, audio, n_bands=6):
        """Extract spectral contrast features"""
        contrast = librosa.feature.spectral_contrast(y=audio, sr=self.sample_rate, n_bands=n_bands)
        return contrast
    
    def extract_pitch(self, audio):
        """Extract pitch features (fundamental frequency)"""
        pitches, magnitudes = librosa.piptrack(y=audio, sr=self.sample_rate)
        pitch = []
        for i in range(magnitudes.shape[1]):
            index = magnitudes[:, i].argmax()
            pitch.append(pitches[index, i])
        return np.array(pitch)
    
    def extract_voice_fingerprint(self, audio_file):
        """Extract comprehensive voice fingerprint from audio file"""
        # Load audio
        if isinstance(audio_file, str) or isinstance(audio_file, Path):
            audio, _ = librosa.load(audio_file, sr=self.sample_rate, mono=True)
        else:
            audio = audio_file
            
        # Extract features
        mfccs = self.extract_mfcc(audio)
        contrast = self.extract_spectral_contrast(audio)
        pitch = self.extract_pitch(audio)
        
        # Compute statistics to get fixed-length representations
        mfcc_stats = np.hstack([
            np.mean(mfccs, axis=1),
            np.std(mfccs, axis=1),
            np.median(mfccs, axis=1)
        ])
        
        contrast_stats = np.hstack([
            np.mean(contrast, axis=1),
            np.std(contrast, axis=1)
        ])
        
        pitch_stats = np.array([
            np.mean(pitch),
            np.std(pitch),
            np.median(pitch),
            np.max(pitch),
            np.min(pitch)
        ])
        
        # Combine all features into a single fingerprint
        fingerprint = np.hstack([mfcc_stats, contrast_stats, pitch_stats])
        
        return fingerprint
    
    def save_model(self, model_path=None):
        """Save the feature extractor model"""
        if model_path is None:
            model_path = self.model_path
        
        if model_path is None:
            raise ValueError("Model path must be specified")
            
        with open(model_path, 'wb') as f:
            pickle.dump(self, f)
    
    @staticmethod
    def load_model(model_path):
        """Load a saved feature extractor model"""
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
        return model
