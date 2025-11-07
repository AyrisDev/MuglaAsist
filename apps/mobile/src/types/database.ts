// Database types for Supabase tables

export type DayName =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type HoursJSON = {
  [key in DayName]?: {
    open: string; // "HH:MM" format
    close: string; // "HH:MM" format
    is_next_day: boolean; // true if closing time is next day
  };
};

export interface Category {
  id: number;
  name: string;
  icon: string;
  is_active: boolean;
  created_at: string;
}

export interface Venue {
  id: number;
  name: string;
  slug: string;
  category_id: number;
  description?: string;
  logo_url?: string;
  cover_url?: string;
  phone?: string;
  location?: string;
  rating?: number; // Average rating (0-5)
  distance?: string; // Distance from user (e.g., "300m", "1.2km")
  hours?: HoursJSON;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
}

export interface VenueWithCategory extends Venue {
  categories: Category;
}

export interface MenuItem {
  id: number;
  venue_id: number;
  name: string;
  description?: string;
  price: number;
  category?: string;
  is_available: boolean;
  is_approved: boolean;
  created_at: string; 
}

export interface VenueDetail extends Venue {
  categories: Category;
  menu_items: MenuItem[];
}

export interface Event {
  id: number;
  title: string;
  description?: string;
  venue_id?: number;
  poster_url?: string;
  event_date: string; // ISO date string
  location?: string;
  is_active: boolean;
  created_at: string;
}

export interface EventWithVenue extends Event {
  venues?: Venue; // Join ile gelecek
}

export interface Deal {
  id: number;
  title: string;
  description?: string;
  venue_id?: number;
  image_url?: string;
  valid_from: string; // ISO date string
  valid_until: string; // ISO date string
  is_active: boolean;
  created_at: string;
}

export interface DealWithVenue extends Deal {
  venues?: Venue; // Join ile gelecek
}

export interface Pharmacy {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
  created_at: string;
}

export interface OnDutyPharmacy {
  id: number;
  pharmacy_id: number;
  duty_date: string; // ISO date string
  created_at: string;
  pharmacy?: Pharmacy; // Join ile gelecek
}

export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface BusRoute {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export interface BusSchedule {
  id: number;
  route_id: number;
  day_of_week: DayOfWeek;
  departure_point: string; // 'Menteşe Otogar', 'Yeniköy', etc.
  departure_times: string[]; // ["08:00", "09:30", "11:00"]
  created_at: string;
}

export interface BusRouteWithSchedules extends BusRoute {
  bus_schedules: BusSchedule[];
}
