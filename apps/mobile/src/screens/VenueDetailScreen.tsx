import React, { useMemo, useState } from 'react'; // useState eklendi
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator, 
  Image,
  TouchableOpacity,
  Linking,
  // SectionList, // Artık kullanılmıyor
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { FoodStackParamList } from '../navigation/FoodStackNavigator';
import { useVenueDetail } from '../hooks/useVenueDetail';
import { isVenueOpen, getAllDaysFormatted } from '../utils/isVenueOpen';
// MenuItem.tsx'den 'MenuItem' TİPİNİ de import etmeniz gerekebilir
// Örn: import MenuItem, { type MenuItem as MenuItemType } from '../components/MenuItem';
import MenuItem from '../components/MenuItem'; 
import { Colors } from '../constants/Colors';
import { Color } from 'react-native/types_generated/Libraries/Animated/AnimatedExports';

type Props = NativeStackScreenProps<FoodStackParamList, 'VenueDetail'>;

// Buraya MenuItem TİPİNİ import edemiyorsanız, geçici olarak ekleyin:
// (En iyi yöntem MenuItem.tsx'den export/import etmektir)
type MenuItemType = {
  id: number;
  name: string;
  description?: string;
  price: number;
  category?: string;
  // ... (interface'inizdeki diğer alanlar)
};


export default function VenueDetailScreen({ route }: Props) {
  const { venueId } = route.params;
const { data: venue, isLoading, error } = useVenueDetail(venueId) || {};

  // YENİ: Açık/kapalı kategorileri takip etmek için state
  // Başlangıçta hepsi kapalı olacak (true)
  const [closedCategories, setClosedCategories] = useState<Record<string, boolean>>(
    {}
  );

  // YENİ: Kategoriyi açıp/kapatan fonksiyon
  const toggleCategory = (title: string) => {
    setClosedCategories(prev => ({
      ...prev,
      [title]: !prev[title], // Mevcut durumu tersine çevir
    }));
  };

 
  const handleCall = () => {
    if (venue?.phone) {
      Linking.openURL(`tel:${venue.phone}`);
    }
  };

  const handleMap = () => {
    if (venue?.location) {
      const query = encodeURIComponent(venue.location);
      Linking.openURL(`https://maps.google.com/?q=${query}`);
    }
  };

  // Veriyi kategorilere ayırma (Değişiklik yok)
const menuSections = useMemo(() => {
    // YENİ KORUMA: 
    // Önce 'venue' yüklendi mi?
    // Sonra 'venue.menu_items' var mı? diye kontrol edin.
    if (!venue || !venue.menu_items || venue.menu_items.length === 0) {
      return []; // Eğer yoksa, reduce'a hiç girmeden boş dizi döndür
    }

    // Eğer kod buraya ulaştıysa, 'venue.menu_items' GÜVENLE kullanılabilir.
    const grouped = venue.menu_items.reduce((acc, item) => {
      const category = item.category || 'Diğer'; 
      
      if (!acc[category]) { // Sizin gösterdiğiniz satır (bu satırın kendisi doğru)
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as { [key: string]: MenuItemType[] }); // MenuItemType'ı doğru import ettiğinizi varsayıyorum

    // Objeyi SectionList'in istediği formata dönüştür
    return Object.keys(grouped).map(title => ({
      title: title,
      data: grouped[title],
    }));

  }, [venue]); // Bağımlılık dizisi [venue] olmalı, [venue.menu_items] değil
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Detaylar yükleniyor...</Text>
      </View>
    );
  }

  if (error || !venue) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Mekan bulunamadı</Text>
      </View>
    );
  }

  const isOpen = isVenueOpen(venue.hours);
  const allDays = getAllDaysFormatted(venue.hours);

  return (
    <ScrollView style={styles.container}>
      {/* Cover Image */}
      {venue.cover_url ? (
        <Image source={{ uri: venue.cover_url }} style={styles.coverImage} />
      ) : (
        <View style={[styles.coverImage, styles.coverPlaceholder]}>
          <Ionicons name="image-outline" size={64} color={Colors.textTertiary} />
        </View>
      )}

      {/* Venue Info */}
      <View style={styles.infoSection}>
        {/* ... (Bu kısımlarda değişiklik yok) ... */}
         <View style={styles.header}>
          {venue.logo_url && (
            <Image source={{ uri: venue.logo_url }} style={styles.logo} />
          )}
          <View style={styles.headerText}>
            <Text style={styles.venueName}>{venue.name}</Text>
            {/* 'categories' bir dizi değilse bu hata verir, kontrol edin */}
            <Text style={styles.categoryName}>{venue.categories.name}</Text>
          </View>
        </View>

        <View style={styles.statusBadge}>
          <View style={[styles.statusDot, isOpen && styles.statusDotOpen]} />
          <Text style={[styles.statusText, isOpen && styles.statusTextOpen]}>
            {isOpen ? 'Şu an açık' : 'Şu an kapalı'}
          </Text>
        </View>

        {venue.description && (
          <Text style={styles.description}>{venue.description}</Text>
        )}

        <View style={styles.actionsContainer}>
          {venue.location && (
            <TouchableOpacity style={styles.actionButton} onPress={handleMap}>
              <Ionicons name="map-outline" size={20} color={Colors.primary} />
              <Text style={styles.actionButtonText}>Haritada Göster</Text>
            </TouchableOpacity>
          )}
          {venue.phone && (
            <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
              <Ionicons name="call-outline" size={20} color={Colors.primary} />
              <Text style={styles.actionButtonText}>Ara</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Working Hours */}
      <View style={styles.section}>
        {/* ... (Bu kısımlarda değişiklik yok) ... */}
        <Text style={styles.sectionTitle}>Çalışma Saatleri</Text>
        {allDays.map((day) => (
          <View
            key={day.day}
            style={[styles.dayRow, day.isToday && styles.dayRowToday]}
          >
            <Text
              style={[styles.dayLabel, day.isToday && styles.dayLabelToday]}
            >
              {day.label}
            </Text>
            <Text
              style={[styles.dayHours, day.isToday && styles.dayHoursToday]}
            >
              {day.formatted}
            </Text>
          </View>
        ))}
      </View>

      {/* Menu - GÜNCELLENMİŞ ALAN */}
      {menuSections && menuSections.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Menü</Text>
          <View style={styles.menuContainer}>
            
            {/* SectionList yerine .map() kullanıyoruz */}
            {menuSections.map((section) => {
              // Kategori kapalı mı? (Başlangıçta kapalı: !prev[title] -> !undefined -> true)
              // Düzeltme: Başlangıçta açık olsun
              const isClosed = closedCategories[section.title]; // false (açık)
              
              return (
                <View key={section.title}>
                  {/* Tıklanabilir Kategori Başlığı */}
                  <TouchableOpacity
                    style={styles.categoryHeader} // Yeni stil
                    onPress={() => toggleCategory(section.title)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.categoryTitleText}>{section.title}</Text>
                    <Ionicons 
                      name={isClosed ? 'chevron-forward-outline' : 'chevron-down-outline'} 
                      size={22} 
                      color={Colors.text} 
                    />
                  </TouchableOpacity>

                  {/* Açılır/Kapanır Menü Öğeleri */}
                  {!isClosed && (
                    <View>
                      {section.data.map(item => (
                        <MenuItem item={item} key={item.id.toString()} />
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // ... (Diğer stillerinizde değişiklik yok) ...
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  // STİL GÜNCELLEMESİ: 'menuCategoryTitle' SİLİNDİ, YENİLER EKLENDİ
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    paddingVertical: 12,
    paddingHorizontal: 16,
    // Kategoriler arası boşluk olmasın, menuContainer halletsin
    // Sadece ilk olmayanlara üst border ekleyebiliriz
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  categoryTitleText: {
    fontSize: 18, // Biraz küçülttük
    fontWeight: 'bold',
    color: Colors.text, // Stil dosyanızdan renk
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.background,
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.error,
  },
  coverImage: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.surfaceLight,
  },
  coverPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoSection: {
    backgroundColor: Colors.surface,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  venueName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 16,
    marginBottom: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.closed,
    marginRight: 6,
  },
  statusDotOpen: {
    backgroundColor: Colors.open,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.closed,
  },
  statusTextOpen: {
    color: Colors.open,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  section: {
    backgroundColor: Colors.surface,
    padding: 16, // Menü için padding'i sıfırlayabiliriz
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dayRowToday: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 8,
    marginHorizontal: -8,
    borderRadius: 6,
  },
  dayLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  dayLabelToday: {
    fontWeight: 'bold',
    color: Colors.primary,
  },
  dayHours: {
    fontSize: 14,
    color: Colors.text,
  },
  dayHoursToday: {
    fontWeight: 'bold',
    color: Colors.primary,
  },
  menuContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
});