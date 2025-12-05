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

// Updated Venue interface based on new schema
export interface Venue {
  id: number;
  created_at: string;
  name: string;
  adress: string; // Note: typo in database (adress instead of address)
  phonenumber: string; // Changed from phone to phonenumber
  image: string; // Changed from logo_url
  cover_image: string; // Changed from cover_url
  description?: string;
  location?: string;
  openedclosetime?: string; // New field
}

export interface VenueWithCategory extends Venue {
  categories?: Category;
}

// Updated Menu interface based on new schema
export interface MenuItem {
  id: number;
  created_at: string;
  title: string; // Changed from name to title
  description?: string;
  image: string;
  category?: string;
  price: number;
  venue_id: number;
}

export interface VenueDetail extends Venue {
  categories?: Category;
  menus?: MenuItem[]; // Changed from menu_items to menus
}

// Updated Event interface based on new schema
export interface Event {
  id: number;
  created_at: string;
  name: string; // Changed from title to name
  description?: string;
  image: string; // Changed from poster_url to image
  cover_image: string; // New field
  date: string; // Changed from event_date to date (timestamptz)
  location?: string;
  venue_id?: number;
}

export interface EventWithVenue extends Event {
  venues?: Venue;
}

// Updated Campaign interface (renamed from Deal)
export interface Campaign {
  id: number;
  created_at: string;
  title: string;
  startDate: string; // Changed from valid_from to startDate (timestamptz)
  endDate: string; // Changed from valid_until to endDate (timestamptz)
  description?: string;
  image: string; // Changed from image_url to image
  cover_image: string; // New field
  venue_id?: number;
}

export interface CampaignWithVenue extends Campaign {
  venues?: Venue;
}

// Keep old Deal types for backward compatibility
export interface Deal extends Campaign { }
export interface DealWithVenue extends CampaignWithVenue { }

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
  duty_date: string;
  created_at: string;
  pharmacy?: Pharmacy;
}

// Updated Route interface based on new schema
export interface Route {
  id: number;
  created_at: string;
  name: string;
  description?: string;
  color: string; // New field
  is_active: boolean;
  map_polyline?: string; // New field
}

// New Stop interface based on new schema
export interface Stop {
  id: number;
  name: string;
  location?: string;
}

// New RouteStop interface (junction table)
export interface RouteStop {
  id: number;
  route_id: number;
  stop_id: number;
  stop_sequence: number;
  arrival_offset_min?: number;
}

// Extended types with relations
export interface RouteWithStops extends Route {
  route_stops?: RouteStopWithStop[];
}

export interface RouteStopWithStop extends RouteStop {
  stops?: Stop;
}

// Legacy BusRoute types for backward compatibility
export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface BusRoute extends Route { }

export interface BusSchedule {
  id: number;
  route_id: number;
  day_of_week: DayOfWeek;
  departure_point: string;
  departure_times: string[];
  created_at: string;
}

export interface BusRouteWithSchedules extends BusRoute {
  bus_schedules?: BusSchedule[];
}
