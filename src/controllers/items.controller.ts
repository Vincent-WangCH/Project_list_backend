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
 * 1. Extract item ID (UUID string) from URL parameters
 * 2. Validate ID format
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
    // Extract ID from URL parameters (now a UUID string)
    const id = req.params.id;

    // Validate that ID is provided
    if (!id || typeof id !== 'string' || id.trim() === '') {
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
 * 2. Validate fields (all are optional with defaults)
 * 3. Call service to create item in database
 * 4. Return created item with 201 status
 *
 * @param req - Express request object (contains body with optional item fields)
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
    const { name, description, quantity, unitPrice, category, date, ownerID } = req.body;

    // Validate fields if provided
    if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
      res.status(400).json({ error: 'Name must be a non-empty string' });
      return;
    }

    if (description !== undefined && typeof description !== 'string') {
      res.status(400).json({ error: 'Description must be a string' });
      return;
    }

    if (quantity !== undefined && (typeof quantity !== 'number' || quantity < 0 || !Number.isInteger(quantity))) {
      res.status(400).json({ error: 'Quantity must be a non-negative integer' });
      return;
    }

    if (unitPrice !== undefined && (typeof unitPrice !== 'number' || unitPrice < 0)) {
      res.status(400).json({ error: 'Unit price must be a non-negative number' });
      return;
    }

    if (category !== undefined && (typeof category !== 'string' || category.trim() === '')) {
      res.status(400).json({ error: 'Category must be a non-empty string' });
      return;
    }

    if (ownerID !== undefined && (typeof ownerID !== 'string' || ownerID.trim() === '')) {
      res.status(400).json({ error: 'Owner ID must be a non-empty string' });
      return;
    }

    // Prepare create data object
    const createData: itemsService.CreateItemInput = {};
    if (name !== undefined) createData.name = name.trim();
    if (description !== undefined) createData.description = description.trim();
    if (quantity !== undefined) createData.quantity = quantity;
    if (unitPrice !== undefined) createData.unitPrice = unitPrice;
    if (category !== undefined) createData.category = category.trim();
    if (date !== undefined) createData.date = date;
    if (ownerID !== undefined) createData.ownerID = ownerID.trim();

    // Call service layer to create item in database via Prisma
    const item = await itemsService.createItem(createData);

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
 * 1. Extract item ID (UUID string) from URL parameters
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
    // Extract ID from URL parameters (UUID string)
    const id = req.params.id;

    // Validate that ID is provided
    if (!id || typeof id !== 'string' || id.trim() === '') {
      res.status(400).json({ error: 'Invalid item ID' });
      return;
    }

    // Extract update data from request body
    const { name, description, quantity, unitPrice, category, date, ownerID } = req.body;

    // Validate that at least one field is provided for update
    if (
      name === undefined &&
      description === undefined &&
      quantity === undefined &&
      unitPrice === undefined &&
      category === undefined &&
      date === undefined &&
      ownerID === undefined
    ) {
      res.status(400).json({
        error: 'At least one field (name, description, quantity, unitPrice, category, date, or ownerID) must be provided'
      });
      return;
    }

    // Validate name if provided
    if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
      res.status(400).json({ error: 'Name must be a non-empty string' });
      return;
    }

    // Validate description if provided
    if (description !== undefined && typeof description !== 'string') {
      res.status(400).json({ error: 'Description must be a string' });
      return;
    }

    // Validate quantity if provided
    if (quantity !== undefined && (typeof quantity !== 'number' || quantity < 0 || !Number.isInteger(quantity))) {
      res.status(400).json({ error: 'Quantity must be a non-negative integer' });
      return;
    }

    // Validate unitPrice if provided
    if (unitPrice !== undefined && (typeof unitPrice !== 'number' || unitPrice < 0)) {
      res.status(400).json({ error: 'Unit price must be a non-negative number' });
      return;
    }

    // Validate category if provided
    if (category !== undefined && (typeof category !== 'string' || category.trim() === '')) {
      res.status(400).json({ error: 'Category must be a non-empty string' });
      return;
    }

    // Validate ownerID if provided
    if (ownerID !== undefined && (typeof ownerID !== 'string' || ownerID.trim() === '')) {
      res.status(400).json({ error: 'Owner ID must be a non-empty string' });
      return;
    }

    // Prepare update data object (only include provided fields)
    const updateData: itemsService.UpdateItemInput = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (quantity !== undefined) updateData.quantity = quantity;
    if (unitPrice !== undefined) updateData.unitPrice = unitPrice;
    if (category !== undefined) updateData.category = category.trim();
    if (date !== undefined) updateData.date = date;
    if (ownerID !== undefined) updateData.ownerID = ownerID.trim();

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
 * 1. Extract item ID (UUID string) from URL parameters
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
    // Extract ID from URL parameters (UUID string)
    const id = req.params.id;

    // Validate that ID is provided
    if (!id || typeof id !== 'string' || id.trim() === '') {
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

