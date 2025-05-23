# Voice Recognition System for Cyber Fraud Investigation

A system designed to help law enforcement agencies identify and track individuals who have committed cyber fraud through voice communication.

## Installation

### Prerequisites

- Python 3.7 or higher
- tkinter (comes with Python, not installed via pip)

### Verifying tkinter installation

tkinter comes with Python's standard library, but some distributions might not include it by default.

To verify tkinter is installed, run:

```python
import tkinter
tkinter._test()  # This should open a small window if tkinter is installed
```

### If tkinter is not installed

- **Windows**: Reinstall Python and make sure to check "tcl/tk and IDLE" during installation
- **Ubuntu/Debian**: `sudo apt-get install python3-tk`
- **Fedora**: `sudo dnf install python3-tkinter`
- **macOS**: Install Python via Homebrew with tkinter: `brew install python-tk`

### Installing Dependencies

Install all other required packages:

```bash
pip install -r requirements.txt
```

## Running the Application

```bash
python main.py
```

This will start the graphical interface for the Voice Recognition System.
```

### Advanced setup and troubleshooting information is available in the documentation.
