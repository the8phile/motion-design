#!/bin/sh
# Builds index.html (English) and index-fr.html (French) from src/ (see src/build.py)
cd "$(dirname "$0")/.." && python3 src/build.py
