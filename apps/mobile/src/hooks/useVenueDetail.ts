import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { VenueDetail } from '../types/database';

export function useVenueDetail(venueId: number) {
  return useQuery({
    queryKey: ['venue', venueId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('venues')
        .select(
          `
          *,
          categories(*),
          menu_items(*)
        `
        )
        .eq('id', venueId)
        .eq('is_active', true)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      // Filter menu items to only show available and approved ones
      const venueDetail = data as VenueDetail;
      if (venueDetail.menu_items) {
        venueDetail.menu_items = venueDetail.menu_items.filter(
          (item) => item.is_available && item.is_approved
        );
      }

      return venueDetail;
    },
  });
}
