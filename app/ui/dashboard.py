import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import os
import threading
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from pathlib import Path
import sys

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
        """Load a voice sample"""
        file_path = filedialog.askopenfilename(
            title="Select Voice Sample",
            filetypes=[("Audio Files", "*.wav *.mp3 *.ogg")]
        )
        
        if file_path:
            self.status_var.set(f"Selected file: {os.path.basename(file_path)}")
            messagebox.showinfo("File Selected", f"Selected file: {file_path}\n\nImplement sample processing here.")
    
    def match_sample(self):
        """Match a voice sample against the database"""
        messagebox.showinfo("Match Sample", "Voice matching functionality would be implemented here.")
    
    def toggle_api_server(self):
        """Toggle the API server on/off"""
        messagebox.showinfo("API Server", "API server toggle functionality would be implemented here.")
    
    def show_error(self, message):
        """Show an error message"""
        messagebox.showerror("Error", message)
        self.status_var.set(f"Error: {message}")

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