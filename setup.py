from setuptools import setup, find_packages

setup(
    name="voice_recognition",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "numpy>=1.19.0",
        "scipy>=1.5.0",
        "librosa>=0.8.0",
        "scikit-learn>=0.24.0",
        "matplotlib>=3.3.0",
        "flask>=2.0.0",
        "flask-restful>=0.3.9",
        "requests>=2.25.0",
        "soundfile>=0.10.0",
        "pygame>=2.0.0",
        "noisereduce>=1.1.0",
        "pillow>=8.0.0",
    ],
    python_requires='>=3.7',
    description="Voice Recognition System for Cyber Fraud Investigation",
    author="Cyber Security Team",
    author_email="example@example.com",
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Law Enforcement",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
    ],
)
