#!/bin/bash

# 1. Enter the osgraph-service directory
cd ./osgraph-service || { echo "Failed to enter osgraph-service directory"; exit 1; }

# 2. Copy OSGraph/.env.template to the current directory and rename it to .env
cp ../.env.template .env || { echo "Failed to copy .env template"; exit 1; }

# 3. Execute pip install poetry
pip install poetry || { echo "Failed to install poetry"; exit 1; }

# 4. Execute poetry install
poetry install --no-root  || { echo "Failed to poetry install"; exit 1; }

# 5. Create the web folder
mkdir -p web || { echo "Failed to create web folder"; exit 1; }

# 6. Enter the osgraph-web directory
cd ../osgraph-web || { echo "Failed to enter osgraph-web directory"; exit 1; }

# 7. Clear npm cache
npm cache clean --force || { echo "Failed to clear npm cache"; exit 1; }

# 8. Execute npm install
npm install || { echo "npm install failed"; exit 1; }

# 9. Execute npm run build
npm run build || { echo "npm run build failed"; exit 1; }

# 10. Copy dist/* to OSGraph/osgraph-service/web
cp -rf ./dist/* ../osgraph-service/web || { echo "Failed to copy dist contents"; exit 1; }

# 11. Remove the dist directory
rm -rf ./dist || { echo "Failed to remove dist directory"; exit 1; }

echo "Build successfully!"
