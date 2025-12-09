/**
 * ============================================================================
 * Prisma Client Singleton (Prisma 7 with Neon Adapter)
 * ============================================================================
 * This file creates and exports a single instance of PrismaClient to be used
 * throughout the application.
 *
 * Prisma 7 Changes:
 * - Requires an adapter when using the "client" engine type
 * - For Neon PostgreSQL, we use @prisma/adapter-neon
 * - The adapter uses Neon's serverless driver for optimal performance
 *
 * Why use a singleton pattern?
 * - Prevents creating multiple database connections
 * - Improves performance by reusing the same connection pool
 * - Avoids "too many connections" errors in development with hot reload
 *
 * How it works:
 * 1. Load environment variables from .env file
 * 2. Create Neon adapter with connection string
 * 3. Pass the adapter to PrismaClient constructor
 * 4. Store in global scope for development hot reload
 * 5. Export the instance for use in services
 * ============================================================================
 */

// Load environment variables first
import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

/**
 * Extend the global namespace to include our Prisma instance
 * This prevents TypeScript errors when accessing global.prisma
 */
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

/**
 * Get Database Connection String
 *
 * The DATABASE_URL is loaded from .env file and should be in this format:
 * postgresql://username:password@host/database?sslmode=require
 *
 * For Neon with connection pooling, use the pooled connection string:
 * postgresql://username:password@host-pooler.region.aws.neon.tech/database?sslmode=require
 */
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

/**
 * Create Prisma Neon Adapter
 *
 * This adapter bridges Prisma Client and Neon's serverless driver:
 * - Uses Neon's serverless driver for low-latency queries over HTTP/WebSockets
 * - Optimized for serverless and edge environments
 * - Handles connection pooling automatically
 * - Works with Neon's connection pooler for better scalability
 *
 * The adapter accepts an object with the connectionString property
 */
const adapter = new PrismaNeon({ connectionString });

/**
 * Create or retrieve the PrismaClient instance
 *
 * In Prisma 7, we must provide the adapter in the constructor.
 *
 * In development:
 * - Hot reload can cause multiple instances to be created
 * - We store the instance in global scope to persist across reloads
 *
 * In production:
 * - A single instance is created and used throughout the app lifecycle
 */
const prisma = global.prisma || new PrismaClient({
  adapter,  // Required in Prisma 7 for Neon
  log: ['query', 'info', 'warn', 'error'], // Enable logging for debugging
});

/**
 * In development mode, store the instance globally
 * This ensures the same instance is reused when the module is reloaded
 */
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

/**
 * Export the singleton instance
 * Import this in your services: import prisma from '../db/prisma';
 */
export default prisma;

