import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';

interface ValidationRule {
  type: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  format?: 'email' | 'url' | string;
  pattern?: RegExp;
  enum?: string[];
}

interface ValidationSchema {
  [key: string]: ValidationRule;
}

const validateRequest = (schema: ValidationSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const errors: string[] = [];
      const { body } = req;

      // Validate each field in schema
      Object.entries(schema).forEach(([field, rule]) => {
        const value = body[field];

        // Check required fields
        if (rule.required && (value === undefined || value === null || value === '')) {
          errors.push(`${field} is required`);
          return;
        }

        // Skip validation if field is not required and not provided
        if (!rule.required && (value === undefined || value === null)) {
          return;
        }

        // Check type
        if (rule.type && typeof value !== rule.type) {
          errors.push(`${field} must be a ${rule.type}`);
          return;
        }

        // Check string length
        if (typeof value === 'string') {
          if (rule.minLength && value.length < rule.minLength) {
            errors.push(`${field} must be at least ${rule.minLength} characters`);
          }
          if (rule.maxLength && value.length > rule.maxLength) {
            errors.push(`${field} must be no more than ${rule.maxLength} characters`);
          }
        }

        // Check format
        if (rule.format === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.push(`${field} must be a valid email address`);
        }

        // Check pattern
        if (rule.pattern && !rule.pattern.test(value)) {
          errors.push(`${field} format is invalid`);
        }

        // Check enum values
        if (rule.enum && !rule.enum.includes(value)) {
          errors.push(`${field} must be one of: ${rule.enum.join(', ')}`);
        }
      });

      if (errors.length > 0) {
        throw new ApiError(400, errors.join(', '));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validateRequest;