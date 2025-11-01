import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

// Bottom Tab Navigator Params
export type RootTabParamList = {
  Food: undefined;
  Transport: undefined;
  Campus: undefined;
};

// Food Stack Navigator Params
export type FoodStackParamList = {
  FoodHome: undefined;
  Categories: undefined;
  VenueList: { categoryId: number; categoryName: string };
  VenueDetail: { venueId: number; venueName: string };
};

// Screen Props Types
export type FoodHomeScreenProps = CompositeScreenProps<
  NativeStackScreenProps<FoodStackParamList, "FoodHome">,
  BottomTabScreenProps<RootTabParamList>
>;

export type CategoriesScreenProps = CompositeScreenProps<
  NativeStackScreenProps<FoodStackParamList, "Categories">,
  BottomTabScreenProps<RootTabParamList>
>;

export type VenueListScreenProps = CompositeScreenProps<
  NativeStackScreenProps<FoodStackParamList, "VenueList">,
  BottomTabScreenProps<RootTabParamList>
>;

export type VenueDetailScreenProps = CompositeScreenProps<
  NativeStackScreenProps<FoodStackParamList, "VenueDetail">,
  BottomTabScreenProps<RootTabParamList>
>;

export type TransportScreenProps = BottomTabScreenProps<
  RootTabParamList,
  "Transport"
>;

export type CampusScreenProps = BottomTabScreenProps<RootTabParamList, "Campus">;
