/**
 * Utility Types for Kotekli App
 * Shared between Admin Panel and Mobile App
 */

// Day names enum
export enum DayName {
  Monday = "monday",
  Tuesday = "tuesday",
  Wednesday = "wednesday",
  Thursday = "thursday",
  Friday = "friday",
  Saturday = "saturday",
  Sunday = "sunday",
}

// Day hours structure
export interface DayHours {
  open: string; // "HH:MM" format (e.g., "09:00")
  close: string; // "HH:MM" format (e.g., "23:00")
  is_next_day: boolean; // true if closing time is next day
}

// Hours JSON type for venues
export type HoursJSON = {
  [key in DayName]?: DayHours;
};

// Generic metadata type
export type Metadata = Record<string, any>;

// Timestamp type
export type Timestamp = string; // ISO 8601 format

// Helper types
export type ID = number;
export type Slug = string;
export type URL = string;
export type Price = number;
export type Markdown = string;

// Status types
export type ActiveStatus = boolean;
export type ApprovalStatus = boolean;
export type FeaturedStatus = boolean;
