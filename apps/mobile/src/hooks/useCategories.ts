import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Category } from '../types/database';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data as Category[];
    },
  });
}
