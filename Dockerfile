# Use Node.js LTS version
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy TypeScript configuration
COPY tsconfig.json ./

# Copy source code
COPY src ./src

# Build the project (compile TypeScript)
RUN npm run build

# Remove devDependencies to reduce image size
RUN npm prune --production && \
    npm cache clean --force

# Expose default port
EXPOSE 8000

# Set default environment variables (can be overridden at runtime)
ENV PORT=8000
ENV ORIGIN=https://dummyjson.com
ENV TTL=120

# Run the caching proxy with dist/index.js
# Using node directly instead of caching-proxy command since we don't npm link in Docker
ENTRYPOINT ["node", "dist/index.js"]
CMD ["--port", "8000", "--origin", "https://dummyjson.com", "--ttl", "120"]
