import { View, StatusBar } from "react-native";
import React from "react";
import { Link } from "expo-router";

const Page = () => {
  return (
    <View>
      <StatusBar barStyle={"dark-content"} />
      <Link href={"/(modals)/login"}>Login</Link>
      <Link href={"/(modals)/search"}>Search</Link>
      <Link href={"/listings/12313"}>Listing</Link>
    </View>
  );
};

export default Page;
