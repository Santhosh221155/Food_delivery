# React Frontend - Build Stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN npm install

# Copy source
COPY . .

# Build for production
RUN npm run build

# Production Stage - Serve with Node
FROM node:22-alpine

WORKDIR /app

# Install serve to run the built app
RUN npm install -g serve

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5173', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Expose port
EXPOSE 5173

# Start application
CMD ["serve", "-s", "dist", "-l", "5173"]
