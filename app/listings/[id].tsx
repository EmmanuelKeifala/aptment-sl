import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import listingsData from "@/assets/data/airbnb-listings.json";
const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  // TODO make the api call to fetch data for this particular id
  const listings = (listingsData as any[]).find((item) => item.id === id);
  
  return (
    <SafeAreaView>
      <Text>Page</Text>
    </SafeAreaView>
  );
};

export default Page;
