# Use Node.js 20 as base image
FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/ai-agents/package.json ./packages/ai-agents/
COPY packages/sdk/package.json ./packages/sdk/
COPY packages/shared/package.json ./packages/shared/
COPY turbo.json tsconfig.base.json ./

# Install dependencies
RUN pnpm install --frozen-lockfile || pnpm install

# Copy source code
COPY apps/web ./apps/web
COPY packages ./packages

# Build the application
RUN pnpm --filter web build

# Production image
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy built application from standalone output
COPY --from=base /app/apps/web/.next/standalone ./
COPY --from=base /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=base /app/apps/web/public ./apps/web/public

# Set working directory to web app
WORKDIR /app/apps/web

# Expose port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["node", "server.js"]
