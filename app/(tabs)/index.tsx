import { View, StatusBar } from "react-native";
import listingsData from "@/assets/data/airbnb-listings.json";
import React, { useMemo, useState } from "react";
import { Link, Stack } from "expo-router";
import ExploreHeader from "@/components/ExploreHeader";
import Listings from "@/components/Listings";
import listingsDataGeo from "@/assets/data/airbnb-listings.geo.json";

import ListingsMap from "@/components/ListingsMap";
const Page = () => {
  const [category, setCategory] = useState("Tiny Homes");

  const items = useMemo(() => listingsData as any, []);
  const onDataChanged = (category: string) => {
    setCategory(category);
  };
  return (
    <View style={{ flex: 1, marginTop: 20 }}>
      {/* <StatusBar barStyle={"dark-content"} /> */}
      <Stack.Screen
        options={{
          header: () => <ExploreHeader onCategoryChanged={onDataChanged} />,
        }}
      />
      {/* <Listings listings={items} category={category} /> */}
      <ListingsMap listings={listingsDataGeo} />
    </View>
  );
};

export default Page;
