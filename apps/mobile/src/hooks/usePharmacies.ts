import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Pharmacy, OnDutyPharmacy } from '../types/database';

// Tüm aktif eczaneleri getir
export function usePharmacies() {
  return useQuery({
    queryKey: ['pharmacies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pharmacies')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data as Pharmacy[];
    },
  });
}

// Bugünün nöbetçi eczanelerini (birden fazla olabilir) getir
export function useOnDutyPharmacies() { // İsmi çoğul yapmak daha mantıklı
  return useQuery({
    queryKey: ['on-duty-pharmacies', new Date().toISOString().split('T')[0]], // queryKey'i de çoğul yaptım
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('on_duty_pharmacy')
        .select(`
          *,
          pharmacy:pharmacies(*)
        `)
        .eq('duty_date', today); // .single() buradan kaldırıldı

      if (error) {
        // .single() kaldırıldığı için 'PGRST116' hatası artık gelmeyecek
        // (tabii RLS vb. başka bir hata yoksa)
        throw new Error(error.message);
      }

      // data artık bir 'OnDutyPharmacy' nesnesi değil,
      // 'OnDutyPharmacy[]' tipinde bir dizidir.
      // Kayıt bulunamazsa, data boş bir dizi [] olacaktır (null değil).
      return data as OnDutyPharmacy[];
    },
  });
}
