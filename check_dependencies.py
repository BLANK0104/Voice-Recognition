"""
Utility script to check if all dependencies are properly installed
"""
import sys
import subprocess
import importlib
import platform

def check_module(module_name, package_name=None):
    """Check if a module is installed and import it"""
    if package_name is None:
        package_name = module_name
    
    try:
        importlib.import_module(module_name)
        print(f"✅ {module_name} is installed")
        return True
    except ImportError:
        print(f"❌ {module_name} is NOT installed. Install with: pip install {package_name}")
        return False

def check_tkinter():
    """Check if tkinter is installed"""
    try:
        import tkinter
        print("✅ tkinter is installed")
        return True
    except ImportError:
        print("❌ tkinter is NOT installed.")
        system = platform.system()
        if system == 'Windows':
            print("    Reinstall Python and check 'tcl/tk and IDLE' during installation")
        elif system == 'Linux':
            if platform.linux_distribution()[0] in ['Ubuntu', 'Debian']:
                print("    Install with: sudo apt-get install python3-tk")
            elif platform.linux_distribution()[0] in ['Fedora', 'CentOS', 'RHEL']:
                print("    Install with: sudo dnf install python3-tkinter")
            else:
                print("    Install tkinter for your specific Linux distribution")
        elif system == 'Darwin':  # macOS
            print("    Install with: brew install python-tk")
        else:
            print("    Please install tkinter for your operating system")
        return False

def main():
    """Check if all required modules are installed"""
    print(f"Python version: {sys.version}")
    print("Checking dependencies...")
    
    # Check core dependencies
    dependencies = [
        ("numpy", "numpy>=1.19.0"),
        ("scipy", "scipy>=1.5.0"),
        ("librosa", "librosa>=0.8.0"),
        ("sklearn", "scikit-learn>=0.24.0"),
        ("matplotlib", "matplotlib>=3.3.0"),
        ("flask", "flask>=2.0.0"),
        ("flask_restful", "flask-restful>=0.3.9"),
        ("requests", "requests>=2.25.0"),
        ("soundfile", "soundfile>=0.10.0"),
        ("pygame", "pygame>=2.0.0"),
        ("noisereduce", "noisereduce>=1.1.0"),
        ("PIL", "pillow>=8.0.0"),
    ]
    
    all_installed = True
    for module_name, package_name in dependencies:
        all_installed &= check_module(module_name, package_name)
    
    # Check tkinter
    all_installed &= check_tkinter()
    
    if all_installed:
        print("\nAll dependencies are installed! ✨")
        print("You can run the application with: python main.py")
    else:
        print("\nSome dependencies are missing. Please install them and try again.")
        print("You can install missing packages with: pip install -r requirements.txt")
        print("Note: tkinter cannot be installed via pip, see README.md for instructions.")

if __name__ == "__main__":
    main()
