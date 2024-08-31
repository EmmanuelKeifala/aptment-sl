import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useRef, useState } from "react";
import { Link, router } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import * as Haptics from "expo-haptics";
import { categories } from "@/constants/data";

interface Props {
  onCategoryChanged: (category: string) => void;
}

const ExploreHeader = ({ onCategoryChanged }: Props) => {
  const scrollRef = useRef<ScrollView>(null);
  const itemsRef = useRef<Array<TouchableOpacity | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const selectCategory = (index: number) => {
    const selected = itemsRef.current[index];
    setActiveIndex(index);
    selected?.measureLayout(scrollRef.current?.getScrollableNode(), (x) => {
      scrollRef.current?.scrollTo({ x: x - 16, animated: true });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCategoryChanged(categories[index].name);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={{ ...styles.actionRow, marginTop: 10 }}>
          <TouchableOpacity
            style={styles.searchBtn}
            onPress={() => {
              router.navigate("/(modals)/search");
            }}
          >
            <Ionicons name="search" size={24} color={Colors.primary} />
            <Text style={styles.searchText}>Search</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          ref={scrollRef}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
          {categories.map((item, index) => (
            <TouchableOpacity
              ref={(el) => (itemsRef.current[index] = el)}
              key={index}
              style={
                activeIndex === index
                  ? styles.categoryButtonActive
                  : styles.categoryButton
              }
              onPress={() => selectCategory(index)}
            >
              <MaterialIcons
                name={item.icon as any}
                size={24}
                color={activeIndex === index ? Colors.primary : Colors.grey}
              />
              <Text
                style={
                  activeIndex === index
                    ? styles.categoryTextActive
                    : styles.categoryText
                }
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    marginTop: 20,
  },
  container: {
    backgroundColor: "#fff",
    height: 130,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    },
    paddingHorizontal: 16,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  searchBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  searchText: {
    fontSize: 16,
    fontFamily: "jakata-sb",
    color: Colors.primary,
    marginLeft: 8,
  },
  scrollViewContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  categoryButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 8,
  },
  categoryButtonActive: {
    alignItems: "center",
    justifyContent: "center",
    borderBottomColor: Colors.primary,
    borderBottomWidth: 2,
    paddingBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: "",
    color: Colors.grey,
  },
  categoryTextActive: {
    fontSize: 14,
    fontFamily: "jakata-sb",
    color: Colors.primary,
  },
});

export default ExploreHeader;
