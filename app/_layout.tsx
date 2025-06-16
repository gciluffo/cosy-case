import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/build/FontAwesome";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }

    // AsyncStorage.clear();
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GluestackUIProvider mode="light">
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen
          name="book-search"
          options={{
            title: "Search",
            headerBackButtonDisplayMode: "generic",
            headerRight: () => (
              <TouchableOpacity
                onPress={() => {
                  router.push("/add-book-scan");
                }}
              >
                <FontAwesome name="barcode" size={24} color="black" />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="add-book"
          options={{
            title: "Add to Library",
            presentation: "modal",
            headerBackButtonDisplayMode: "generic",
          }}
        />
        <Stack.Screen
          name="add-case"
          options={{
            title: "Add Bookcase",
            presentation: "modal",
            headerBackButtonDisplayMode: "generic",
          }}
        />
        <Stack.Screen
          name="add-book-details"
          options={{
            title: "Add to Library",
            presentation: "modal",
            headerBackButtonDisplayMode: "generic",
          }}
        />
        <Stack.Screen
          name="book-details"
          options={{
            headerTransparent: true,
            headerTitle: "",
            headerTintColor: "white", // or any contrasting color for your back button
            headerBackButtonDisplayMode: "generic",
            headerRight: () => (
              <TouchableOpacity
                onPress={() => {
                  // open amazon link for book
                }}
              >
                <FontAwesome name="shopping-cart" size={24} color="white" />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="case-details"
          options={{
            headerTransparent: true,
            headerTitle: "",
            headerTintColor: "white", // or any contrasting color for your back button
            headerBackButtonDisplayMode: "generic",
            headerRight: () => (
              <TouchableOpacity
              // onPress={() => {
              //   router.push("/book-search");
              // }}
              >
                <FontAwesome name="share" size={24} color="white" />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="book-spine-camera-view"
          options={{
            title: "",
            headerTransparent: true,
            headerBackButtonDisplayMode: "generic",
          }}
        />
        <Stack.Screen
          name="add-book-from-library"
          options={{
            title: "Select Books to Add",
            presentation: "modal",
            headerBackButtonDisplayMode: "generic",
          }}
        />
        <Stack.Screen
          name="add-book-scan"
          options={{
            headerTransparent: true,
            headerTitle: "Scan barcode",
            headerTintColor: "white", // or any contrasting color for your back button
            headerBackButtonDisplayMode: "generic",
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </GluestackUIProvider>
  );
}
