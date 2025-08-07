import { Types } from 'mongoose';

/**
 * Validates if a string is a valid MongoDB ObjectId
 * @param id
 * @returns
 */
export function validateObjectId(id: string): Types.ObjectId | null {
  if (!id || typeof id !== 'string') {
    return null;
  }
  
  try {
    return new Types.ObjectId(id);
  } catch (error) {
    return null;
  }
}

/**
 * Validates an array of strings as ObjectIds
 * @param ids
 * @returns
 */
export function validateObjectIds(ids: string[]): Types.ObjectId[] {
  if (!Array.isArray(ids)) {
    return [];
  }
  
  const validIds: Types.ObjectId[] = [];
  for (const id of ids) {
    const validId = validateObjectId(id);
    if (validId) {
      validIds.push(validId);
    }
  }
  
  return validIds;
}

/**
 * Sanitizes a string for safe use in regex patterns
 * @param str
 * @returns
 */
export function sanitizeRegexString(str: string): string {
  if (!str || typeof str !== 'string') {
    return '';
  }
  
  // Escape regex special characters
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
