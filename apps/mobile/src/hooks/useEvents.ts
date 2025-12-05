import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Event, EventWithVenue } from '../types/database';

interface UseEventsOptions {
  upcoming?: boolean; // Only future events
}

export function useEvents(options: UseEventsOptions = {}) {
  const { upcoming = true } = options;

  return useQuery({
    queryKey: ['events', upcoming],
    queryFn: async () => {
      let query = supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      // Only get upcoming events (future dates)
      if (upcoming) {
        const now = new Date().toISOString();
        query = query.gte('date', now);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return data as Event[];
    },
  });
}

// Hook for fetching a single event by ID with venue info
export function useEventDetail(eventId: number) {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          venues(*)
        `)
        .eq('id', eventId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as EventWithVenue;
    },
  });
}
