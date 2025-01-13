#!/bin/bash
cd ./osgraph-service || { echo "Failed to enter osgraph-service directory"; exit 1; }

python run.py || { echo "Failed to execute run.py"; exit 1; }

echo "Script completed successfully!"