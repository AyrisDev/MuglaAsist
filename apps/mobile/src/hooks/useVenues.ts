import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { VenueWithCategory } from '../types/database';

interface UseVenuesOptions {
  categoryId?: number;
  isFeatured?: boolean;
}

export function useVenues(options: UseVenuesOptions = {}) {
  const { categoryId, isFeatured } = options;

  return useQuery({
    queryKey: ['venues', categoryId, isFeatured],
    queryFn: async () => {
      let query = supabase
        .from('venues')
        .select('*, categories(*)')
        .eq('is_active', true);

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      if (isFeatured !== undefined) {
        query = query.eq('is_featured', isFeatured);
      }

      query = query.order('name', { ascending: true });

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return data as VenueWithCategory[];
    },
  });
}
