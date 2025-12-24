# Node.js API Gateway - Multi-instance Ready
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY src ./src
COPY .env .env

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Expose port (will be mapped differently for each instance in docker-compose)
EXPOSE 3000

# Start application
CMD ["node", "--require", "dotenv/config", "src/server.js"]
