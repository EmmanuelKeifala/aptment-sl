import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
} from "react-native";
import React, { useRef, useState } from "react";
import { Link } from "expo-router";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import Colors from "@/constants/Colors";
import { Listing } from "@/types/Listings";

interface Props {
  listings: Listing[];
  category: string;
}

const Listings = ({ listings: items, category }: Props) => {
  const [data, setData] = useState(items);
  const list = useRef<FlashList<Listing> | null>(null);

  const removeItem = (itemId: number) => {
    setData((prevData) => prevData.filter((item) => +item.id !== +itemId));
    list.current?.prepareForLayoutAnimationRender();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const renderItem = ({ item }: { item: Listing }) => (
    <TouchableOpacity onPress={() => removeItem(+item.id)}>
      <Link href={`/listings/${item.id}`} asChild>
        <TouchableOpacity>
          <Animated.View
            style={styles.listing}
            entering={FadeInRight}
            exiting={FadeOutLeft}
          >
            <Animated.Image
              source={{ uri: item.medium_url }}
              style={styles.image}
            />
            <TouchableOpacity style={styles.heartIcon}>
              <Ionicons name="heart-outline" size={24} color="#000" />
            </TouchableOpacity>
            <View style={styles.details}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.roomType}>{item.room_type}</Text>
              <Text style={styles.price}>SLE {item.price}/year</Text>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Link>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlashList
        ref={list}
        keyExtractor={(item) => `${item.id}-${item.name}`} // Ensure unique key
        renderItem={renderItem}
        data={data}
        estimatedItemSize={300} // Adjust if necessary
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#f9f9f9",
    marginTop: 100,
  },
  listing: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  heartIcon: {
    position: "absolute",
    right: 20,
    top: 20,
  },
  details: {
    marginTop: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: "jakata-sb",
    color: "#333",
  },
  roomType: {
    fontSize: 14,
    fontFamily: "jakata",
    color: "#888",
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    fontFamily: "jakata-sb",
    color: Colors.primary,
    marginTop: 8,
  },
});

export default Listings;
