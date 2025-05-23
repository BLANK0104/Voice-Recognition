import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from scipy.spatial.distance import euclidean
import pickle
from sklearn.cluster import DBSCAN
import os
import json
import datetime
from collections import Counter

class VoiceMatcher:
    def __init__(self):
        self.fingerprints = {}  # Dictionary to store voice fingerprints
        self.metadata = {}      # Dictionary to store metadata for each sample
        self.known_fraudsters = {}  # Dictionary to store known fraudster fingerprints
        self.match_history = []  # List to store match history for analysis
        
    def add_fingerprint(self, sample_id, fingerprint, metadata=None):
        """Add a voice fingerprint to the database"""
        self.fingerprints[sample_id] = fingerprint
        if metadata:
            self.metadata[sample_id] = metadata
        
    def remove_fingerprint(self, sample_id):
        """Remove a voice fingerprint from the database"""
        if sample_id in self.fingerprints:
            del self.fingerprints[sample_id]
        if sample_id in self.metadata:
            del self.metadata[sample_id]
    
    def calculate_similarity(self, fingerprint1, fingerprint2, method='cosine'):
        """Calculate similarity between two voice fingerprints"""
        if method == 'cosine':
            # Reshape for cosine similarity
            fp1 = fingerprint1.reshape(1, -1)
            fp2 = fingerprint2.reshape(1, -1)
            similarity = cosine_similarity(fp1, fp2)[0][0]
            return similarity
        elif method == 'euclidean':
            # Lower distance means higher similarity, so we invert
            distance = euclidean(fingerprint1, fingerprint2)
            # Convert to similarity score (0 to 1)
            similarity = 1 / (1 + distance)
            return similarity
        else:
            raise ValueError(f"Unsupported similarity method: {method}")
    
    def find_matches(self, query_fingerprint, threshold=0.8, method='cosine', limit=10):
        """Find matches for a query fingerprint"""
        similarities = []
        
        for sample_id, fingerprint in self.fingerprints.items():
            similarity = self.calculate_similarity(query_fingerprint, fingerprint, method)
            similarities.append((sample_id, similarity))
        
        # Sort by similarity in descending order
        similarities.sort(key=lambda x: x[1], reverse=True)
        
        # Filter by threshold and limit
        matches = [match for match in similarities if match[1] >= threshold][:limit]
        
        return matches
    
    def group_similar_voices(self, eps=0.3, min_samples=2):
        """Group similar voice samples using clustering"""
        if not self.fingerprints:
            return {}
            
        # Convert fingerprints to a numpy array
        sample_ids = list(self.fingerprints.keys())
        X = np.array([self.fingerprints[id] for id in sample_ids])
        
        # Use DBSCAN for clustering
        clustering = DBSCAN(eps=eps, min_samples=min_samples, metric='cosine').fit(X)
        
        # Group by cluster
        groups = {}
        for i, label in enumerate(clustering.labels_):
            if label not in groups:
                groups[label] = []
            groups[label].append(sample_ids[i])
        
        return groups
    
    def find_fraudster_matches(self, query_fingerprint, threshold=0.7, method='cosine', limit=10):
        """Find matches specifically from known fraudster database"""
        similarities = []
        
        for fraudster_id, fingerprint in self.known_fraudsters.items():
            similarity = self.calculate_similarity(query_fingerprint, fingerprint, method)
            similarities.append((fraudster_id, similarity))
        
        # Sort by similarity in descending order
        similarities.sort(key=lambda x: x[1], reverse=True)
        
        # Filter by threshold and limit
        matches = [match for match in similarities if match[1] >= threshold][:limit]
        
        return matches
    
    def add_known_fraudster(self, fraudster_id, fingerprint, metadata=None):
        """Add a known fraudster voice fingerprint to the database"""
        self.known_fraudsters[fraudster_id] = fingerprint
        if metadata:
            if 'is_fraudster' not in metadata:
                metadata['is_fraudster'] = True
            if 'date_marked_as_fraudster' not in metadata:
                metadata['date_marked_as_fraudster'] = datetime.datetime.now().isoformat()
            self.metadata[fraudster_id] = metadata
    
    def detect_voice_manipulation(self, fingerprint, reference_fingerprints=None):
        """
        Detect potential voice manipulation or disguise
        Returns a score indicating likelihood of manipulation (0-1)
        """
        # If no reference fingerprints provided, use all available samples
        if reference_fingerprints is None:
            reference_fingerprints = list(self.fingerprints.values())
        
        if not reference_fingerprints:
            return 0.0, "No reference fingerprints available"
            
        # Compute variance of key features that tend to be stable in natural voices
        pitch_features_idx = slice(-5, None)  # Assuming last 5 features are pitch-related
        pitch_variance = np.var(fingerprint[pitch_features_idx])
        
        # Compare with average variance in reference samples
        reference_variances = [np.var(fp[pitch_features_idx]) for fp in reference_fingerprints]
        avg_reference_variance = np.mean(reference_variances)
        
        # Calculate manipulation probability
        # Higher variance relative to reference suggests potential manipulation
        if avg_reference_variance > 0:
            manipulation_score = min(1.0, pitch_variance / (2 * avg_reference_variance))
        else:
            manipulation_score = 0.0
        
        # Additional checks for extreme values that may indicate manipulation
        extremity_score = 0.0
        for i, feature in enumerate(fingerprint):
            ref_values = [fp[i] for fp in reference_fingerprints]
            mean_val = np.mean(ref_values)
            std_val = np.std(ref_values) or 1.0  # Avoid division by zero
            
            # Check how many standard deviations away from mean
            z_score = abs(feature - mean_val) / std_val
            if z_score > 3.0:  # More than 3 standard deviations is unusual
                extremity_score += min(1.0, (z_score - 3.0) / 5.0)
        
        extremity_score = min(1.0, extremity_score / len(fingerprint))
        
        # Combine scores
        final_score = 0.7 * manipulation_score + 0.3 * extremity_score
        
        # Determine confidence level
        if final_score > 0.8:
            confidence = "High probability of voice manipulation"
        elif final_score > 0.5:
            confidence = "Moderate probability of voice manipulation"
        elif final_score > 0.3:
            confidence = "Low probability of voice manipulation"
        else:
            confidence = "Likely natural voice"
        
        return final_score, confidence
    
    def calculate_fraud_probability(self, query_fingerprint, threshold=0.5):
        """
        Calculate the probability that a voice sample belongs to a fraudster
        based on similarity to known fraudster database
        """
        if not self.known_fraudsters:
            return 0.0, "No known fraudsters in database"
        
        # Get matches from fraudster database
        matches = self.find_fraudster_matches(query_fingerprint, threshold=threshold)
        
        if not matches:
            return 0.0, "No matches to known fraudsters"
        
        # Calculate weighted probability based on similarity scores
        total_similarity = sum(similarity for _, similarity in matches)
        num_matches = len(matches)
        
        if num_matches == 0 or total_similarity == 0:
            return 0.0, "No significant matches"
        
        # Base probability on highest similarity score and number of matches
        highest_similarity = matches[0][1] if matches else 0
        
        # Weight by number of matches found
        match_weight = min(1.0, num_matches / 3.0)  # Cap at 3 matches
        
        # Final probability calculation
        fraud_probability = highest_similarity * (0.7 + 0.3 * match_weight)
        
        # Store match in history for future analysis
        self.match_history.append({
            'timestamp': datetime.datetime.now().isoformat(),
            'highest_similarity': highest_similarity,
            'num_matches': num_matches,
            'fraud_probability': fraud_probability
        })
        
        # Determine confidence level
        if fraud_probability > 0.85:
            confidence = "Very high probability of fraud"
        elif fraud_probability > 0.7:
            confidence = "High probability of fraud"
        elif fraud_probability > 0.5:
            confidence = "Moderate probability of fraud"
        elif fraud_probability > 0.3:
            confidence = "Low probability of fraud"
        else:
            confidence = "Very low probability of fraud"
        
        return fraud_probability, confidence
    
    def analyze_voice_patterns(self, sample_ids=None):
        """
        Analyze voice patterns across multiple samples to identify common characteristics
        Useful for detecting criminal organizations or repeated fraud attempts
        """
        if not sample_ids:
            sample_ids = list(self.fingerprints.keys())
        
        if len(sample_ids) < 2:
            return {"error": "Need at least 2 samples for pattern analysis"}
        
        # Get the fingerprints
        fingerprints = [self.fingerprints[id] for id in sample_ids if id in self.fingerprints]
        
        if len(fingerprints) < 2:
            return {"error": "Not enough valid samples found"}
        
        # Calculate similarity matrix
        similarity_matrix = np.zeros((len(fingerprints), len(fingerprints)))
        for i in range(len(fingerprints)):
            for j in range(i, len(fingerprints)):
                sim = self.calculate_similarity(fingerprints[i], fingerprints[j])
                similarity_matrix[i, j] = sim
                similarity_matrix[j, i] = sim
        
        # Calculate average similarity
        avg_similarity = np.sum(similarity_matrix) / (len(fingerprints) * (len(fingerprints) - 1))
        
        # Find clusters
        clusters = self.group_similar_voices(eps=0.3, min_samples=2)
        
        # Get metadata for pattern analysis
        pattern_data = {}
        for id in sample_ids:
            if id in self.metadata:
                meta = self.metadata[id]
                for key, value in meta.items():
                    if key not in pattern_data:
                        pattern_data[key] = []
                    pattern_data[key].append(value)
        
        # Find common patterns in metadata
        patterns = {}
        for key, values in pattern_data.items():
            if len(values) > 1:
                counter = Counter(values)
                most_common = counter.most_common(3)
                if most_common[0][1] > 1:  # If appears more than once
                    patterns[key] = most_common
        
        return {
            "sample_count": len(fingerprints),
            "average_similarity": float(avg_similarity),
            "cluster_count": len(clusters),
            "common_patterns": patterns
        }
    
    def export_match_report(self, matches, output_format="json", file_path=None):
        """
        Export match results in a format suitable for law enforcement
        Formats: json, csv, txt
        """
        report = {
            "report_date": datetime.datetime.now().isoformat(),
            "match_count": len(matches),
            "matches": []
        }
        
        for sample_id, similarity in matches:
            match_data = {
                "sample_id": sample_id,
                "similarity_score": float(similarity),
                "metadata": self.metadata.get(sample_id, {})
            }
            
            # Add fraud probability if it's a known fraudster
            if sample_id in self.known_fraudsters:
                match_data["is_known_fraudster"] = True
            
            report["matches"].append(match_data)
        
        if output_format == "json":
            output = json.dumps(report, indent=2)
            
        elif output_format == "csv":
            import csv
            import io
            output = io.StringIO()
            writer = csv.writer(output)
            
            # Write header
            writer.writerow(["Sample ID", "Similarity Score", "Is Known Fraudster", "Metadata"])
            
            # Write data
            for match in report["matches"]:
                writer.writerow([
                    match["sample_id"],
                    match["similarity_score"],
                    match.get("is_known_fraudster", False),
                    json.dumps(match["metadata"])
                ])
            
            output = output.getvalue()
            
        elif output_format == "txt":
            lines = [
                f"Voice Recognition Match Report",
                f"Generated: {report['report_date']}",
                f"Total Matches: {report['match_count']}",
                f"\n--- Match Details ---\n"
            ]
            
            for i, match in enumerate(report["matches"]):
                lines.append(f"Match #{i+1}:")
                lines.append(f"  Sample ID: {match['sample_id']}")
                lines.append(f"  Similarity: {match['similarity_score']:.4f}")
                if match.get("is_known_fraudster"):
                    lines.append(f"  WARNING: KNOWN FRAUDSTER")
                
                lines.append("  Metadata:")
                for key, value in match["metadata"].items():
                    lines.append(f"    {key}: {value}")
                lines.append("")
            
            output = "\n".join(lines)
        
        else:
            raise ValueError(f"Unsupported output format: {output_format}")
        
        # Save to file if path provided
        if file_path:
            with open(file_path, 'w') as f:
                f.write(output)
        
        return output
    
    def save_database(self, file_path):
        """Save the fingerprint database to a file"""
        data = {
            'fingerprints': self.fingerprints,
            'metadata': self.metadata,
            'known_fraudsters': self.known_fraudsters,
            'match_history': self.match_history
        }
        with open(file_path, 'wb') as f:
            pickle.dump(data, f)
    
    def load_database(self, file_path):
        """Load the fingerprint database from a file"""
        if os.path.exists(file_path):
            with open(file_path, 'rb') as f:
                data = pickle.load(f)
            self.fingerprints = data.get('fingerprints', {})
            self.metadata = data.get('metadata', {})
            self.known_fraudsters = data.get('known_fraudsters', {})
            self.match_history = data.get('match_history', [])
            return True
        return False
