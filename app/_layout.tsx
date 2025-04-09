import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
          }}
        />
        <Stack.Screen
          name="add-book"
          options={{
            title: "Add to Library",
            presentation: "modal",
            headerBackButtonDisplayMode: "minimal",
          }}
        />
        <Stack.Screen
          name="add-book-details"
          options={{
            title: "Add to Library",
            presentation: "modal",
            headerBackButtonDisplayMode: "minimal",
          }}
        />
        <Stack.Screen
          name="book-details"
          options={{
            title: "",
          }}
        />
        <Stack.Screen
          name="book-spine-camera-view"
          options={{
            title: "",
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </GluestackUIProvider>
  );
}
