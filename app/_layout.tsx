import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useFonts } from "expo-font";
import {
  Stack,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Linking, TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/build/FontAwesome";
import { isTablet } from "@/utils/scale";
import useStore from "@/store";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const { user } = useStore();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
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
            presentation: isTablet ? "fullScreenModal" : "modal",
            headerLeft: () => {
              return (
                isTablet && (
                  <TouchableOpacity
                    onPress={() => {
                      router.back();
                    }}
                  >
                    <FontAwesome
                      name="chevron-left"
                      size={25}
                      color="#3b82f6"
                    />
                    {/* <Text className="text-blue-500">Back</Text> */}
                  </TouchableOpacity>
                )
              );
            },
            headerBackButtonDisplayMode: "generic",
          }}
        />
        <Stack.Screen
          name="add-case"
          options={{
            title: "Add Bookcase",
            presentation: isTablet ? "fullScreenModal" : "modal",
            headerLeft: () => {
              return (
                isTablet && (
                  <TouchableOpacity
                    onPress={() => {
                      router.back();
                    }}
                  >
                    <FontAwesome
                      name="chevron-left"
                      size={25}
                      color="#3b82f6"
                    />
                    {/* <Text className="text-blue-500">Back</Text> */}
                  </TouchableOpacity>
                )
              );
            },
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
            headerRight: (props) => (
              <TouchableOpacity
                onPress={() => {
                  const routes = navigation.getState()?.routes;
                  const bookDetailsRoute = routes?.find(
                    (route) => route.name === "book-details"
                  );
                  const isbn =
                    (bookDetailsRoute?.params &&
                    typeof bookDetailsRoute.params === "object" &&
                    "isbn13" in bookDetailsRoute.params
                      ? (bookDetailsRoute.params as { isbn13?: string }).isbn13
                      : undefined) ||
                    (typeof params === "object" && "isbn" in params
                      ? (params as { isbn?: string }).isbn
                      : undefined);
                  if (isbn) {
                    // TODO: Update this to an affiliate link or a custom URL scheme
                    const amazonLink = `https://www.amazon.com/s?k=${isbn}`;
                    Linking.openURL(amazonLink);
                  }
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
          }}
        />
        <Stack.Screen
          name="book-spine-camera-view"
          options={{
            title: "",
            headerTransparent: true,
            headerBackButtonDisplayMode: "generic",
            presentation: "fullScreenModal",
            headerLeft: () => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    router.back();
                    router.setParams({
                      refetchSpineImages: "true",
                    });
                  }}
                >
                  {/* Show x icon similar to instagram */}
                  <FontAwesome name="times" size={35} color="white" />
                </TouchableOpacity>
              );
            },
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
          name="book-list"
          options={{
            title: "Case Contents",
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
        <Stack.Screen
          name="single-case-display"
          options={{
            headerTransparent: true,
            headerTitle: "",
            headerTintColor: "white", // or any contrasting color for your back button
            headerBackButtonDisplayMode: "generic",
          }}
        />
        <Stack.Screen
          name="shared-bookcase"
          options={{
            headerTransparent: true,
            headerTitle: "",
            headerTintColor: "white", // or any contrasting color for your back button
            headerBackButtonDisplayMode: "generic",
          }}
        />
        <Stack.Screen
          name="add-books-from-case"
          options={{
            title: "Move Books",
            presentation: "modal",
            headerBackButtonDisplayMode: "generic",
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </GluestackUIProvider>
  );
}
