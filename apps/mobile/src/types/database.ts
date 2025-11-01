// Database Types
export type DayName =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type HoursJSON = {
  [key in DayName]?: {
    open: string; // "HH:MM"
    close: string; // "HH:MM"
    is_next_day: boolean;
  };
};

export interface Category {
  id: number;
  name: string;
  icon: string;
  slug: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Venue {
  id: number;
  name: string;
  slug: string;
  category_id: number;
  description: string | null;
  logo_url: string | null;
  cover_url: string | null;
  phone: string | null;
  location: string | null;
  hours: HoursJSON | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  categories?: Category;
}

export interface MenuItem {
  id: number;
  venue_id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  is_available: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceData {
  id: number;
  data_key: string;
  title: string;
  content: string; // Markdown
  metadata: Record<string, any> | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Deal {
  id: number;
  venue_id: number;
  title: string;
  description: string;
  discount_text: string | null;
  image_url: string | null;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  location: string | null;
  event_date: string;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Supabase Database Type
export interface Database {
  public: {
    Tables: {
      categories: {
        Row: Category;
        Insert: Omit<Category, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Category, "id" | "created_at" | "updated_at">>;
      };
      venues: {
        Row: Venue;
        Insert: Omit<Venue, "id" | "slug" | "created_at" | "updated_at">;
        Update: Partial<Omit<Venue, "id" | "slug" | "created_at" | "updated_at">>;
      };
      menu_items: {
        Row: MenuItem;
        Insert: Omit<MenuItem, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<MenuItem, "id" | "created_at" | "updated_at">>;
      };
      services_data: {
        Row: ServiceData;
        Insert: Omit<ServiceData, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<ServiceData, "id" | "created_at" | "updated_at">>;
      };
      deals: {
        Row: Deal;
        Insert: Omit<Deal, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Deal, "id" | "created_at" | "updated_at">>;
      };
      events: {
        Row: Event;
        Insert: Omit<Event, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Event, "id" | "created_at" | "updated_at">>;
      };
    };
  };
}
