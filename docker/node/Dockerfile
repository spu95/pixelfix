FROM node:20-alpine

# Set working directory
WORKDIR /var/www/frontend

# Copy package files
COPY services/node/package.json ./
COPY services/node/package-lock.json* ./

# Install dependencies
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy application code
COPY services/node/. .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Start application in development mode
CMD ["npm", "run", "dev"]
