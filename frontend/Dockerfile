# Use Node base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy root package.json
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy everything
COPY . .

# Build React app
RUN npm install
RUN npm run build

# Expose port
EXPOSE 80

# Start server
CMD ["npm", "start"]