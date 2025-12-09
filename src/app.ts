/**
 * ============================================================================
 * Express Application Configuration
 * ============================================================================
 * This file sets up and configures the Express application with all necessary
 * middleware and routes.
 *
 * Responsibilities:
 * - Create Express app instance
 * - Configure middleware (JSON parsing, CORS, etc.)
 * - Register route handlers
 * - Set up error handling
 *
 * This file exports the configured app, which is then started in index.ts
 * ============================================================================
 */

import express, { Application } from 'express';
import itemsRoutes from './routes/items.routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

/**
 * Create Express Application
 *
 * This function creates and configures the Express app with all middleware
 * and routes. It's separated from the server startup (index.ts) to make
 * testing easier.
 *
 * @returns Configured Express application
 */
const createApp = (): Application => {
  // Create Express app instance
  const app = express();

  // ============================================================================
  // Middleware Configuration
  // ============================================================================

  /**
   * JSON Body Parser Middleware
   *
   * Parses incoming requests with JSON payloads.
   * Makes the parsed data available in req.body
   *
   * Example: POST request with body { "name": "Laptop" }
   * After this middleware: req.body.name === "Laptop"
   */
  app.use(express.json());

  /**
   * URL-Encoded Body Parser Middleware
   *
   * Parses incoming requests with URL-encoded payloads (form data).
   * Extended option allows for rich objects and arrays to be encoded.
   */
  app.use(express.urlencoded({ extended: true }));

  // ============================================================================
  // Routes Configuration
  // ============================================================================

  /**
   * Health Check Endpoint
   *
   * Simple endpoint to verify the server is running.
   * Useful for monitoring and load balancers.
   *
   * GET /health
   * Response: { status: "ok", timestamp: "2024-01-01T00:00:00.000Z" }
   */
  app.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * Items Routes
   *
   * All routes defined in items.routes.ts will be prefixed with /items
   *
   * Available endpoints:
   * - GET    /items      - Get all items
   * - GET    /items/:id  - Get item by ID
   * - POST   /items      - Create new item
   * - PUT    /items/:id  - Update item by ID
   * - DELETE /items/:id  - Delete item by ID
   */
  app.use('/items', itemsRoutes);

  // ============================================================================
  // Error Handling
  // ============================================================================

  /**
   * 404 Not Found Handler
   *
   * This middleware catches all requests that don't match any defined routes.
   * It must be placed after all route definitions.
   *
   * Returns: 404 status with error message
   */
  app.use(notFoundHandler);

  /**
   * Global Error Handler
   *
   * This middleware catches all errors thrown in the application.
   * It must be the last middleware in the chain.
   *
   * Handles:
   * - Validation errors (400)
   * - Not found errors (404)
   * - Prisma errors (various)
   * - Internal server errors (500)
   *
   * Returns: Appropriate status code with error message
   */
  app.use(errorHandler);

  return app;
};

// Create and export the configured app
const app = createApp();

export default app;

