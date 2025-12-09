/**
 * ============================================================================
 * Items Routes
 * ============================================================================
 * This file defines all the HTTP routes (endpoints) for item-related operations.
 * 
 * Route Responsibilities:
 * - Define URL paths for each endpoint
 * - Map HTTP methods (GET, POST, PUT, DELETE) to controller functions
 * - Organize related endpoints together
 * 
 * RESTful API Design:
 * - GET    /items      - Retrieve all items
 * - GET    /items/:id  - Retrieve a specific item by ID
 * - POST   /items      - Create a new item
 * - PUT    /items/:id  - Update an existing item by ID
 * - DELETE /items/:id  - Delete an item by ID
 * 
 * Data Flow:
 * HTTP Request → Route → Controller → Service → Prisma → Database
 * ============================================================================
 */

import { Router } from 'express';
import * as itemsController from '../controllers/items.controller';

// Create a new Express Router instance
// This router will handle all /items routes
const router = Router();

/**
 * GET /items
 * 
 * Retrieve all items from the database
 * 
 * Response: 200 OK
 * Body: Array of item objects
 * Example: [{ id: 1, name: "Laptop", price: 999.99, description: "...", createdAt: "...", updatedAt: "..." }]
 */
router.get('/', itemsController.getAllItems);

/**
 * GET /items/:id
 * 
 * Retrieve a single item by its ID
 * 
 * URL Parameters:
 * - id: The unique identifier of the item (number)
 * 
 * Response: 200 OK if found, 404 Not Found if item doesn't exist
 * Body: Item object or error message
 * Example Success: { id: 1, name: "Laptop", price: 999.99, ... }
 * Example Error: { error: "Item not found" }
 */
router.get('/:id', itemsController.getItemById);

/**
 * POST /items
 * 
 * Create a new item in the database
 * 
 * Request Body (JSON):
 * {
 *   "name": "Laptop",           // Required: string, non-empty
 *   "price": 999.99,            // Required: number, greater than 0
 *   "description": "Gaming laptop" // Optional: string
 * }
 * 
 * Response: 201 Created if successful, 400 Bad Request if validation fails
 * Body: Created item object or error message
 * Example Success: { id: 1, name: "Laptop", price: 999.99, ... }
 * Example Error: { error: "Name is required and must be a non-empty string" }
 */
router.post('/', itemsController.createItem);

/**
 * PUT /items/:id
 * 
 * Update an existing item by its ID
 * Supports partial updates - only provided fields will be updated
 * 
 * URL Parameters:
 * - id: The unique identifier of the item to update (number)
 * 
 * Request Body (JSON) - All fields are optional:
 * {
 *   "name": "Updated Laptop",      // Optional: string, non-empty
 *   "price": 1099.99,              // Optional: number, greater than 0
 *   "description": "New description" // Optional: string
 * }
 * 
 * Response: 200 OK if successful, 404 Not Found if item doesn't exist, 400 Bad Request if validation fails
 * Body: Updated item object or error message
 * Example Success: { id: 1, name: "Updated Laptop", price: 1099.99, ... }
 * Example Error: { error: "Item not found" }
 */
router.put('/:id', itemsController.updateItem);

/**
 * DELETE /items/:id
 * 
 * Delete an item from the database by its ID
 * 
 * URL Parameters:
 * - id: The unique identifier of the item to delete (number)
 * 
 * Response: 200 OK if successful, 404 Not Found if item doesn't exist
 * Body: Success confirmation or error message
 * Example Success: { success: true, message: "Item deleted successfully" }
 * Example Error: { error: "Item not found" }
 */
router.delete('/:id', itemsController.deleteItem);

// Export the router to be used in the main app
export default router;

