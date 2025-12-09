/**
 * ============================================================================
 * Items Service Layer
 * ============================================================================
 * This file contains all business logic and database operations for Items.
 * 
 * Separation of Concerns:
 * - Services handle business logic and database operations
 * - Controllers handle HTTP request/response
 * - Routes define endpoint URLs
 * 
 * All Prisma database operations are performed here and exported to controllers.
 * ============================================================================
 */

import prisma from '../db/prisma';
import { Item } from '@prisma/client';

/**
 * Interface for creating a new item
 * Defines the required and optional fields when creating an item
 */
export interface CreateItemInput {
  name: string;
  price: number;
  description?: string;
}

/**
 * Interface for updating an existing item
 * All fields are optional to support partial updates
 */
export interface UpdateItemInput {
  name?: string;
  price?: number;
  description?: string;
}

/**
 * Get All Items
 * 
 * Retrieves all items from the database using Prisma's findMany method.
 * 
 * Prisma Operation: findMany()
 * - Fetches multiple records from the database
 * - Returns an array of Item objects
 * - If no items exist, returns an empty array
 * 
 * @returns Promise<Item[]> - Array of all items in the database
 */
export const getAllItems = async (): Promise<Item[]> => {
  // Prisma findMany: SELECT * FROM "Item"
  const items = await prisma.item.findMany({
    orderBy: {
      createdAt: 'desc', // Sort by newest first
    },
  });
  
  return items;
};

/**
 * Get Item by ID
 * 
 * Retrieves a single item by its unique ID using Prisma's findUnique method.
 * 
 * Prisma Operation: findUnique()
 * - Fetches a single record by a unique identifier (@id or @@unique field)
 * - Returns the item object if found, null if not found
 * 
 * @param id - The unique ID of the item to retrieve
 * @returns Promise<Item | null> - The item if found, null otherwise
 */
export const getItemById = async (id: number): Promise<Item | null> => {
  // Prisma findUnique: SELECT * FROM "Item" WHERE id = ?
  const item = await prisma.item.findUnique({
    where: {
      id, // Shorthand for id: id
    },
  });
  
  return item;
};

/**
 * Create New Item
 * 
 * Creates a new item in the database using Prisma's create method.
 * 
 * Prisma Operation: create()
 * - Inserts a new record into the database
 * - Returns the created item with all fields (including auto-generated ones)
 * - Automatically sets createdAt and updatedAt timestamps
 * 
 * @param data - Object containing name, price, and optional description
 * @returns Promise<Item> - The newly created item
 * @throws Error if validation fails or database constraint is violated
 */
export const createItem = async (data: CreateItemInput): Promise<Item> => {
  // Prisma create: INSERT INTO "Item" (name, price, description) VALUES (?, ?, ?)
  const item = await prisma.item.create({
    data: {
      name: data.name,
      price: data.price,
      description: data.description,
      // createdAt and updatedAt are set automatically by Prisma
    },
  });
  
  return item;
};

/**
 * Update Item
 * 
 * Updates an existing item by ID using Prisma's update method.
 * Supports partial updates - only provided fields are updated.
 * 
 * Prisma Operation: update()
 * - Updates an existing record in the database
 * - Returns the updated item
 * - Automatically updates the updatedAt timestamp
 * - Throws error if item with given ID doesn't exist
 * 
 * @param id - The unique ID of the item to update
 * @param data - Object containing fields to update (name, price, description)
 * @returns Promise<Item> - The updated item
 * @throws Error if item not found (Prisma error P2025)
 */
export const updateItem = async (
  id: number,
  data: UpdateItemInput
): Promise<Item> => {
  // Prisma update: UPDATE "Item" SET ... WHERE id = ?
  const item = await prisma.item.update({
    where: {
      id,
    },
    data: {
      // Only include fields that are provided (partial update)
      ...(data.name !== undefined && { name: data.name }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.description !== undefined && { description: data.description }),
      // updatedAt is automatically updated by Prisma
    },
  });
  
  return item;
};

/**
 * Delete Item
 * 
 * Deletes an item from the database by ID using Prisma's delete method.
 * 
 * Prisma Operation: delete()
 * - Removes a record from the database
 * - Returns the deleted item
 * - Throws error if item with given ID doesn't exist
 * 
 * @param id - The unique ID of the item to delete
 * @returns Promise<Item> - The deleted item
 * @throws Error if item not found (Prisma error P2025)
 */
export const deleteItem = async (id: number): Promise<Item> => {
  // Prisma delete: DELETE FROM "Item" WHERE id = ?
  const item = await prisma.item.delete({
    where: {
      id,
    },
  });
  
  return item;
};

