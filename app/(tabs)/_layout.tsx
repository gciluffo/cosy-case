import { router, Tabs } from "expo-router";
import React from "react";
import { Dimensions, Platform, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { TabBarBackground } from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { isTablet, verticalScale } from "@/utils/scale";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const screenWidth = Dimensions.get("window").width;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarItemStyle: { alignItems: "center", flexDirection: "row" },
        tabBarStyle: {
          position: "absolute",
          width: 200,
          marginLeft: (screenWidth - 200) / 2,
          marginBottom: Platform.OS === "android" ? 20 : 30,
          elevation: 5,
          backgroundColor: Colors[colorScheme ?? "light"].background,
          borderRadius: 30,
          height: verticalScale(isTablet ? 40 : 45),
          paddingBottom: 10,
          paddingTop: 10,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Displays",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="bookshelf" size={28} color={color} />
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push("/add-case")}>
              <IconSymbol
                size={24}
                name="plus"
                color={Colors[colorScheme ?? "light"].tint}
                style={{
                  marginRight: 16,
                  padding: 8,
                  borderRadius: 12,
                  opacity: 0.8,
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                }}
              />
            </TouchableOpacity>
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: "Books",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="book.pages" color={color} />
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push("/book-search")}>
              <IconSymbol
                size={24}
                name="plus"
                color={Colors[colorScheme ?? "light"].tint}
                style={{
                  marginRight: 16,
                  padding: 8,
                  borderRadius: 12,
                  opacity: 0.8,
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                }}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="trophy" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
