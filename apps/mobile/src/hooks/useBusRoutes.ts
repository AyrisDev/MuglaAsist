import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { BusRoute, BusRouteWithSchedules, BusSchedule } from '../types/database';

// Tüm aktif otobüs hatlarını getir
export function useBusRoutes() {
  return useQuery({
    queryKey: ['bus-routes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bus_routes')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data as BusRoute[];
    },
  });
}

// Belirli bir hattın kalkış noktalarını getir
export function useDeparturePoints(routeId: number) {
  return useQuery({
    queryKey: ['departure-points', routeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bus_schedules')
        .select('departure_point')
        .eq('route_id', routeId);

      if (error) {
        throw new Error(error.message);
      }

      // Unique departure points
      const uniquePoints = [...new Set(data.map(item => item.departure_point))];
      return uniquePoints;
    },
    enabled: routeId > 0,
  });
}

// Belirli bir hattın saatlerini getir (belirli kalkış noktası için)
export function useBusRouteSchedules(routeId: number, departurePoint?: string) {
  return useQuery({
    queryKey: ['bus-route-schedules', routeId, departurePoint],
    queryFn: async () => {
      let query = supabase
        .from('bus_schedules')
        .select('*')
        .eq('route_id', routeId);

      if (departurePoint) {
        query = query.eq('departure_point', departurePoint);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return data as BusSchedule[];
    },
    enabled: routeId > 0,
  });
}
