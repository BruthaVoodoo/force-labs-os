# Multi-stage build for optimized production image
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build the Next.js app
RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /app

# Install dumb-init to handle signals properly
RUN apk add --no-cache dumb-init

# Copy package files
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built app from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose port 5000
EXPOSE 5000

# Set NODE_ENV to production
ENV NODE_ENV=production

# Run with dumb-init to handle signals
ENTRYPOINT ["dumb-init", "--"]

# Start the app on port 5000
CMD ["node_modules/.bin/next", "start", "-p", "5000"]
