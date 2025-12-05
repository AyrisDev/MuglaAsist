import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Deal, DealWithVenue } from '../types/database';

interface UseDealsOptions {
  active?: boolean; // Only current/future deals
}

export function useDeals(options: UseDealsOptions = {}) {
  const { active = true } = options;

  return useQuery({
    queryKey: ['deals', active],
    queryFn: async () => {
      let query = supabase
        .from('campaigns')
        .select(`
          *,
          venues(*)
        `)
        .order('endDate', { ascending: true });

      // Only get active deals (end date in the future)
      if (active) {
        const now = new Date().toISOString();
        query = query.gte('endDate', now);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return data as Deal[];
    },
  });
}

// Hook for fetching a single deal by ID with venue info
export function useDealDetail(dealId: number) {
  return useQuery({
    queryKey: ['deal', dealId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deals')
        .select(`
          *,
          venues(*)
        `)
        .eq('id', dealId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as DealWithVenue;
    },
  });
}
