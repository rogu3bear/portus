# Use Node.js LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install system dependencies needed for building
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./


# Install Node.js dependencies with legacy peer deps to handle dependency conflicts
RUN npm install --legacy-peer-deps

# Install TypeScript types for Node.js
RUN npm install --save-dev @types/node

# Copy the rest of the application
COPY . .


# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 5173

# Start the application in development mode
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
