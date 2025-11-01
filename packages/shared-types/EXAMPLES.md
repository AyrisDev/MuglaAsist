# Kullanım Örnekleri

## 1. Supabase Client Setup

### Admin Panel (Next.js):

```typescript
// apps/admin/src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@kotekli/shared-types";

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

### Mobile App (Expo):

```typescript
// apps/mobile/src/lib/supabase.ts
import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import type { Database } from "@kotekli/shared-types";

export const supabase = createClient<Database>(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: {
        getItem: (key) => SecureStore.getItemAsync(key),
        setItem: (key, value) => SecureStore.setItemAsync(key, value),
        removeItem: (key) => SecureStore.deleteItemAsync(key),
      },
    },
  }
);
```

## 2. Custom Hooks

### useVenues Hook:

```typescript
// Shared hook (can be used in both admin and mobile)
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Venue, VenueWithCategory } from "@kotekli/shared-types";

export function useVenues(categoryId?: number) {
  return useQuery({
    queryKey: ["venues", categoryId],
    queryFn: async () => {
      let query = supabase
        .from("venues")
        .select("*, categories(*)")
        .eq("is_active", true);

      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as VenueWithCategory[];
    },
  });
}
```

### useCategories Hook:

```typescript
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Category } from "@kotekli/shared-types";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as Category[];
    },
  });
}
```

### useMenuItems Hook:

```typescript
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { MenuItem } from "@kotekli/shared-types";

export function useMenuItems(venueId: number) {
  return useQuery({
    queryKey: ["menuItems", venueId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("venue_id", venueId)
        .eq("is_available", true)
        .eq("is_approved", true);

      if (error) throw error;
      return data as MenuItem[];
    },
  });
}
```

## 3. Form Handling

### Admin - Create Venue Form:

```typescript
// apps/admin/src/components/VenueForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { VenueInsert, HoursJSON, DayName } from "@kotekli/shared-types";

const venueSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category_id: z.number(),
  description: z.string().nullable(),
  logo_url: z.string().url().nullable(),
  cover_url: z.string().url().nullable(),
  phone: z.string().nullable(),
  location: z.string().nullable(),
  hours: z.custom<HoursJSON>().nullable(),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

type VenueFormData = z.infer<typeof venueSchema>;

export function VenueForm() {
  const { register, handleSubmit } = useForm<VenueFormData>({
    resolver: zodResolver(venueSchema),
  });

  const onSubmit = async (data: VenueFormData) => {
    const venueData: VenueInsert = data;

    const { error } = await supabase.from("venues").insert(venueData);

    if (error) {
      console.error("Error creating venue:", error);
    }
  };

  return <form onSubmit={handleSubmit(onSubmit)}>{/* ... */}</form>;
}
```

## 4. Hours JSON Helper Functions

```typescript
// Shared utility functions
import type { HoursJSON, DayName } from "@kotekli/shared-types";

export function isVenueOpen(hours: HoursJSON | null, date: Date = new Date()): boolean {
  if (!hours) return false;

  const dayNames: DayName[] = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const currentDay = dayNames[date.getDay()] as DayName;
  const dayHours = hours[currentDay];

  if (!dayHours) return false;

  const currentTime = date.getHours() * 60 + date.getMinutes();
  const [openHour, openMin] = dayHours.open.split(":").map(Number);
  const [closeHour, closeMin] = dayHours.close.split(":").map(Number);

  const openTime = openHour * 60 + openMin;
  let closeTime = closeHour * 60 + closeMin;

  if (dayHours.is_next_day) {
    closeTime += 24 * 60; // Add 24 hours
  }

  return currentTime >= openTime && currentTime < closeTime;
}

export function formatHours(hours: HoursJSON | null, day: DayName): string {
  if (!hours || !hours[day]) return "Kapalı";

  const { open, close, is_next_day } = hours[day]!;
  return `${open} - ${close}${is_next_day ? " (ertesi gün)" : ""}`;
}
```

## 5. Service Data (Ring, Yemekhane)

```typescript
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { ServiceData, ServiceDataKey } from "@kotekli/shared-types";

export function useServiceData(key: ServiceDataKey) {
  return useQuery({
    queryKey: ["serviceData", key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services_data")
        .select("*")
        .eq("data_key", key)
        .eq("is_active", true)
        .single();

      if (error) throw error;
      return data as ServiceData;
    },
  });
}

// Usage:
const { data: ringData } = useServiceData(ServiceDataKey.BusRing);
const { data: cafeteriaData } = useServiceData(ServiceDataKey.CafeteriaMenu);
```

## 6. Type-safe Components

### React Native - Venue Card:

```typescript
import React from "react";
import { View, Text, Image } from "react-native";
import type { Venue } from "@kotekli/shared-types";

interface VenueCardProps {
  venue: Venue;
  onPress: (venue: Venue) => void;
}

export function VenueCard({ venue, onPress }: VenueCardProps) {
  return (
    <View onTouchEnd={() => onPress(venue)}>
      {venue.logo_url && <Image source={{ uri: venue.logo_url }} />}
      <Text>{venue.name}</Text>
      {venue.description && <Text>{venue.description}</Text>}
    </View>
  );
}
```

### Next.js - Venue List:

```typescript
import type { VenueWithCategory } from "@kotekli/shared-types";

interface VenueListProps {
  venues: VenueWithCategory[];
}

export function VenueList({ venues }: VenueListProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {venues.map((venue) => (
        <div key={venue.id} className="card">
          <h3>{venue.name}</h3>
          <p>{venue.categories.name}</p>
        </div>
      ))}
    </div>
  );
}
```

## 7. Mutations (Create/Update/Delete)

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { VenueInsert, VenueUpdate } from "@kotekli/shared-types";

// Create
export function useCreateVenue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (venue: VenueInsert) => {
      const { data, error } = await supabase
        .from("venues")
        .insert(venue)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["venues"] });
    },
  });
}

// Update
export function useUpdateVenue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: VenueUpdate }) => {
      const { error } = await supabase
        .from("venues")
        .update(data)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["venues"] });
    },
  });
}

// Delete
export function useDeleteVenue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("venues").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["venues"] });
    },
  });
}
```

## 8. Type Guards

```typescript
import type { Venue, Category } from "@kotekli/shared-types";

export function isVenue(obj: any): obj is Venue {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.id === "number" &&
    typeof obj.name === "string" &&
    typeof obj.slug === "string"
  );
}

export function isCategory(obj: any): obj is Category {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.id === "number" &&
    typeof obj.name === "string"
  );
}
```

## 9. Utility Functions

```typescript
import type { MenuItem, Price } from "@kotekli/shared-types";

export function formatPrice(price: Price): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(price);
}

export function groupMenuItemsByCategory(items: MenuItem[]) {
  return items.reduce((acc, item) => {
    const category = item.category || "Diğer";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);
}
```
