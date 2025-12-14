# Stage 1: Build the Application
FROM node:20-alpine AS build

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json explicitly (not using wildcard to catch errors early)
COPY package.json ./

# Copy package-lock.json if it exists (optional, won't fail if missing)
COPY package-lock.json* ./

# Verify package.json was copied successfully
RUN test -f package.json || (echo "ERROR: package.json not found! Build context may be incorrect." && ls -la && exit 1)

# Install dependencies
RUN npm ci --only=production || npm install --production

# Copy the rest of the application source code
COPY . .

# Stage 2: Create the Final Production Image
FROM node:20-alpine AS runner

# Set the working directory
WORKDIR /usr/src/app

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy the node_modules and application files from the 'build' stage
COPY --from=build --chown=nodejs:nodejs /usr/src/app/node_modules ./node_modules
COPY --from=build --chown=nodejs:nodejs /usr/src/app/package.json ./
COPY --from=build --chown=nodejs:nodejs /usr/src/app .

# Expose the port your app runs on
ENV PORT=8080
EXPOSE 8080

# Switch to non-root user
USER nodejs

# Define the command to start your application
CMD ["node", "index.js"]
