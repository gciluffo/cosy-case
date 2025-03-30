import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Case",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="book.pages" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: "List",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="list.bullet" color={color} />
          ),
          headerShown: true,
          headerRight: () => (
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
          ),
        }}
      />
    </Tabs>
  );
}
