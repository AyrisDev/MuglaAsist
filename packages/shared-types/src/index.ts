/**
 * @kotekli/shared-types
 * Shared TypeScript types for Kotekli App
 *
 * Usage:
 * import type { Venue, Category, Database } from '@kotekli/shared-types';
 */

// Export all utility types
export * from "./utils.types";

// Export all database types
export * from "./database.types";

// Re-export commonly used types for convenience
export type {
  Category,
  Venue,
  MenuItem,
  ServiceData,
  Deal,
  Event,
  Database,
} from "./database.types";

export type {
  DayName,
  DayHours,
  HoursJSON,
} from "./utils.types";
