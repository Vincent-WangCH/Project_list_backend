/**
 * ============================================================================
 * Application Entry Point
 * ============================================================================
 * This is the main entry point of the application. It starts the Express server
 * and handles the server lifecycle.
 * 
 * Responsibilities:
 * - Load environment variables
 * - Import the configured Express app
 * - Start the HTTP server
 * - Handle graceful shutdown
 * - Log server status
 * ============================================================================
 */

import dotenv from 'dotenv';
import app from './app';
import prisma from './db/prisma';

// Load environment variables from .env file
// This must be done before accessing process.env variables
dotenv.config();

/**
 * Server Configuration
 * 
 * Get the port from environment variables or use default port 3000
 * The PORT can be configured in the .env file
 */
const PORT = process.env.PORT || 3000;

/**
 * Start Server
 * 
 * This function starts the Express server and listens for incoming requests.
 * It also sets up graceful shutdown handlers.
 */
const startServer = async (): Promise<void> => {
  try {
    /**
     * Test Database Connection
     * 
     * Before starting the server, verify that we can connect to the database.
     * This helps catch configuration errors early.
     */
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    /**
     * Start HTTP Server
     * 
     * The server listens on the specified port for incoming HTTP requests.
     * Once started, the application is ready to handle API requests.
     */
    const server = app.listen(PORT, () => {
      console.log('🚀 Server is running');
      console.log(`📡 Listening on port ${PORT}`);
      console.log(`🔗 API URL: http://localhost:${PORT}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      console.log(`📦 Items API: http://localhost:${PORT}/items`);
      console.log('\n💡 Press Ctrl+C to stop the server\n');
    });

    /**
     * Graceful Shutdown Handler
     * 
     * This function handles the shutdown process when the server is stopped.
     * It ensures that:
     * 1. The server stops accepting new requests
     * 2. Existing requests are completed
     * 3. Database connections are closed properly
     * 
     * This prevents data corruption and connection leaks.
     */
    const gracefulShutdown = async (signal: string): Promise<void> => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);

      // Stop accepting new requests
      server.close(async () => {
        console.log('✅ HTTP server closed');

        try {
          // Close database connections
          await prisma.$disconnect();
          console.log('✅ Database connections closed');
          
          console.log('👋 Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          console.error('❌ Error during shutdown:', error);
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds if graceful shutdown fails
      setTimeout(() => {
        console.error('⚠️  Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    /**
     * Register Shutdown Handlers
     * 
     * Listen for termination signals and trigger graceful shutdown
     * - SIGTERM: Termination signal (e.g., from process manager)
     * - SIGINT: Interrupt signal (e.g., Ctrl+C in terminal)
     */
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    /**
     * Startup Error Handler
     * 
     * If the server fails to start (e.g., database connection error),
     * log the error and exit the process.
     */
    console.error('❌ Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

/**
 * Start the Application
 * 
 * Call the startServer function to begin the application lifecycle
 */
startServer();

