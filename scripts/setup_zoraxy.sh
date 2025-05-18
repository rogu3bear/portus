#!/bin/bash

# Download Zoraxy binary
curl -L -o zoraxy https://github.com/tobychui/zoraxy/releases/download/v3.1.9/zoraxy_linux_arm64

# Make it executable
chmod +x zoraxy

# Create data directory
mkdir -p data

# Start Zoraxy with config
./zoraxy -config ./zoraxy_config.yaml
