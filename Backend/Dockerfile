FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application files
COPY . .

# Expose port
EXPOSE 3001

# Create volume for SQLite database
VOLUME ["/app/data"]

# Start the application
CMD ["node", "server.js"]