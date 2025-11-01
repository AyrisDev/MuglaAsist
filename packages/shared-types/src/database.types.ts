/**
 * Database Types for Kotekli App
 * Auto-generated types for Supabase tables
 */

import type {
  HoursJSON,
  Metadata,
  Timestamp,
  ID,
  Slug,
  URL,
  Price,
  Markdown,
  ActiveStatus,
  ApprovalStatus,
  FeaturedStatus,
} from "./utils.types";

// =============================================================================
// CATEGORIES TABLE
// =============================================================================

export interface Category {
  id: ID;
  name: string;
  icon: string; // Icon name or emoji
  slug: Slug;
  display_order: number;
  is_active: ActiveStatus;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export type CategoryInsert = Omit<Category, "id" | "created_at" | "updated_at">;
export type CategoryUpdate = Partial<CategoryInsert>;

// =============================================================================
// VENUES TABLE
// =============================================================================

export interface Venue {
  id: ID;
  name: string;
  slug: Slug;
  category_id: ID;
  description: string | null;
  logo_url: URL | null;
  cover_url: URL | null;
  phone: string | null;
  location: string | null;
  hours: HoursJSON | null;
  is_featured: FeaturedStatus;
  is_active: ActiveStatus;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export type VenueInsert = Omit<Venue, "id" | "slug" | "created_at" | "updated_at">;
export type VenueUpdate = Partial<VenueInsert>;

// Venue with relation
export interface VenueWithCategory extends Venue {
  categories: Category;
}

// =============================================================================
// MENU_ITEMS TABLE
// =============================================================================

export interface MenuItem {
  id: ID;
  venue_id: ID;
  name: string;
  description: string | null;
  price: Price;
  image_url: URL | null;
  category: string | null; // Menu category (e.g., "Drinks", "Main Course")
  is_available: boolean;
  is_approved: ApprovalStatus; // For AI menu approval
  created_at: Timestamp;
  updated_at: Timestamp;
}

export type MenuItemInsert = Omit<MenuItem, "id" | "created_at" | "updated_at">;
export type MenuItemUpdate = Partial<MenuItemInsert>;

// MenuItem with venue relation
export interface MenuItemWithVenue extends MenuItem {
  venues: Venue;
}

// =============================================================================
// SERVICES_DATA TABLE
// =============================================================================

export interface ServiceData {
  id: ID;
  data_key: string; // "bus_ring", "bus_center", "cafeteria_menu"
  title: string;
  content: Markdown; // Markdown content
  metadata: Metadata | null;
  is_active: ActiveStatus;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export type ServiceDataInsert = Omit<ServiceData, "id" | "created_at" | "updated_at">;
export type ServiceDataUpdate = Partial<ServiceDataInsert>;

// Service data keys enum
export enum ServiceDataKey {
  BusRing = "bus_ring",
  BusCenter = "bus_center",
  CafeteriaMenu = "cafeteria_menu",
}

// =============================================================================
// DEALS TABLE (Faz 3)
// =============================================================================

export interface Deal {
  id: ID;
  venue_id: ID;
  title: string;
  description: string;
  discount_text: string | null; // e.g., "20% OFF"
  image_url: URL | null;
  start_date: Timestamp;
  end_date: Timestamp;
  is_active: ActiveStatus;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export type DealInsert = Omit<Deal, "id" | "created_at" | "updated_at">;
export type DealUpdate = Partial<DealInsert>;

// Deal with venue relation
export interface DealWithVenue extends Deal {
  venues: Venue;
}

// =============================================================================
// EVENTS TABLE (Faz 3)
// =============================================================================

export interface Event {
  id: ID;
  title: string;
  description: string;
  location: string | null;
  event_date: Timestamp;
  image_url: URL | null;
  is_active: ActiveStatus;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export type EventInsert = Omit<Event, "id" | "created_at" | "updated_at">;
export type EventUpdate = Partial<EventInsert>;

// =============================================================================
// DATABASE SCHEMA TYPE (for Supabase client)
// =============================================================================

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: Category;
        Insert: CategoryInsert;
        Update: CategoryUpdate;
      };
      venues: {
        Row: Venue;
        Insert: VenueInsert;
        Update: VenueUpdate;
      };
      menu_items: {
        Row: MenuItem;
        Insert: MenuItemInsert;
        Update: MenuItemUpdate;
      };
      services_data: {
        Row: ServiceData;
        Insert: ServiceDataInsert;
        Update: ServiceDataUpdate;
      };
      deals: {
        Row: Deal;
        Insert: DealInsert;
        Update: DealUpdate;
      };
      events: {
        Row: Event;
        Insert: EventInsert;
        Update: EventUpdate;
      };
    };
    Views: {
      admin_stats: {
        Row: {
          total_categories: number;
          total_venues: number;
          active_venues: number;
          featured_venues: number;
          total_menu_items: number;
          pending_approvals: number;
        };
      };
    };
    Functions: {};
    Enums: {};
  };
}
