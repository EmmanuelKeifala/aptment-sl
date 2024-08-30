import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  console.log("search id:", id);
  return (
    <SafeAreaView>
      <Text>Page</Text>
    </SafeAreaView>
  );
};

export default Page;
