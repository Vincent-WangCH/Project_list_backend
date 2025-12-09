/**
 * ============================================================================
 * Items Controller
 * ============================================================================
 * This file handles HTTP request/response logic for item-related endpoints.
 *
 * Controller Responsibilities:
 * - Extract data from HTTP requests (body, params, query)
 * - Validate request data
 * - Call appropriate service functions
 * - Format and send HTTP responses
 * - Handle errors and pass them to error middleware
 *
 * Data Flow:
 * Route → Controller → Service → Prisma → Database
 * Database → Prisma → Service → Controller → Response
 * ============================================================================
 */

import { Request, Response, NextFunction } from 'express';
import * as itemsService from '../services/items.service';

/**
 * Get All Items Controller
 *
 * Handles GET /items requests
 *
 * Flow:
 * 1. Receive HTTP GET request
 * 2. Call service to fetch all items from database
 * 3. Return items as JSON with 200 status
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function (for error handling)
 */
export const getAllItems = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Call service layer to get all items from database via Prisma
    const items = await itemsService.getAllItems();

    // Send successful response with items array
    res.status(200).json(items);
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
};

/**
 * Get Item by ID Controller
 *
 * Handles GET /items/:id requests
 *
 * Flow:
 * 1. Extract item ID from URL parameters
 * 2. Convert ID to number and validate
 * 3. Call service to fetch item from database
 * 4. Return item if found (200) or error if not found (404)
 *
 * @param req - Express request object (contains params.id)
 * @param res - Express response object
 * @param next - Express next function (for error handling)
 */
export const getItemById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract and parse ID from URL parameters
    const id = parseInt(req.params.id, 10);

    // Validate that ID is a valid number
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid item ID' });
      return;
    }

    // Call service layer to get item by ID from database via Prisma
    const item = await itemsService.getItemById(id);

    // Check if item exists
    if (!item) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }

    // Send successful response with item data
    res.status(200).json(item);
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
};

/**
 * Create Item Controller
 *
 * Handles POST /items requests
 *
 * Flow:
 * 1. Extract item data from request body
 * 2. Validate required fields (name, price)
 * 3. Call service to create item in database
 * 4. Return created item with 201 status
 *
 * @param req - Express request object (contains body with name, price, description)
 * @param res - Express response object
 * @param next - Express next function (for error handling)
 */
export const createItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract data from request body
    const { name, price, description } = req.body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim() === '') {
      res.status(400).json({ error: 'Name is required and must be a non-empty string' });
      return;
    }

    if (price === undefined || typeof price !== 'number' || price <= 0) {
      res.status(400).json({ error: 'Price is required and must be greater than 0' });
      return;
    }

    // Call service layer to create item in database via Prisma
    const item = await itemsService.createItem({
      name: name.trim(),
      price,
      description: description?.trim(),
    });

    // Send successful response with created item (201 = Created)
    res.status(201).json(item);
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
};

/**
 * Update Item Controller
 *
 * Handles PUT /items/:id requests
 *
 * Flow:
 * 1. Extract item ID from URL parameters
 * 2. Extract update data from request body
 * 3. Validate ID and update data
 * 4. Call service to update item in database
 * 5. Return updated item with 200 status
 *
 * @param req - Express request object (contains params.id and body with fields to update)
 * @param res - Express response object
 * @param next - Express next function (for error handling)
 */
export const updateItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract and parse ID from URL parameters
    const id = parseInt(req.params.id, 10);

    // Validate that ID is a valid number
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid item ID' });
      return;
    }

    // Extract update data from request body
    const { name, price, description } = req.body;

    // Validate that at least one field is provided for update
    if (name === undefined && price === undefined && description === undefined) {
      res.status(400).json({ error: 'At least one field (name, price, or description) must be provided' });
      return;
    }

    // Validate name if provided
    if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
      res.status(400).json({ error: 'Name must be a non-empty string' });
      return;
    }

    // Validate price if provided
    if (price !== undefined && (typeof price !== 'number' || price <= 0)) {
      res.status(400).json({ error: 'Price must be greater than 0' });
      return;
    }

    // Prepare update data object (only include provided fields)
    const updateData: itemsService.UpdateItemInput = {};
    if (name !== undefined) updateData.name = name.trim();
    if (price !== undefined) updateData.price = price;
    if (description !== undefined) updateData.description = description?.trim();

    // Call service layer to update item in database via Prisma
    const item = await itemsService.updateItem(id, updateData);

    // Send successful response with updated item
    res.status(200).json(item);
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
};

/**
 * Delete Item Controller
 *
 * Handles DELETE /items/:id requests
 *
 * Flow:
 * 1. Extract item ID from URL parameters
 * 2. Validate ID
 * 3. Call service to delete item from database
 * 4. Return success message with 200 status
 *
 * @param req - Express request object (contains params.id)
 * @param res - Express response object
 * @param next - Express next function (for error handling)
 */
export const deleteItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract and parse ID from URL parameters
    const id = parseInt(req.params.id, 10);

    // Validate that ID is a valid number
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid item ID' });
      return;
    }

    // Call service layer to delete item from database via Prisma
    await itemsService.deleteItem(id);

    // Send successful response with confirmation message
    res.status(200).json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
};

