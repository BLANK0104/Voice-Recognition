import os
import sys
from pathlib import Path

# Add the parent directory to the path so Python can find the app package
app_path = Path(__file__).parent
sys.path.append(str(app_path))

# Create necessary folders
os.makedirs(os.path.join(app_path, "data", "samples"), exist_ok=True)
os.makedirs(os.path.join(app_path, "data", "processed"), exist_ok=True)
os.makedirs(os.path.join(app_path, "data", "temp"), exist_ok=True)
os.makedirs(os.path.join(app_path, "models"), exist_ok=True)

# Try to import after setting up the path
try:
    from app.ui.dashboard import start_application
    
    # Start the application
    if __name__ == "__main__":
        start_application()
except ImportError as e:
    print(f"Error importing application modules: {e}")
    print("\nPossible solutions:")
    print("1. Make sure all required packages are installed (run check_dependencies.py)")
    print("2. Check that the application structure is intact")
    print("3. Make sure you're running the script from the correct directory")
    
    # Additional debug info
    print("\nDebug information:")
    print(f"Current directory: {os.getcwd()}")
    print(f"Script location: {app_path}")
    print(f"Python path: {sys.path}")
    
    # Check if essential files exist
    ui_init = os.path.join(app_path, "app", "ui", "__init__.py")
    dashboard = os.path.join(app_path, "app", "ui", "dashboard.py")
    
    print(f"\nChecking for essential files:")
    print(f"app/ui/__init__.py exists: {os.path.exists(ui_init)}")
    print(f"app/ui/dashboard.py exists: {os.path.exists(dashboard)}")
