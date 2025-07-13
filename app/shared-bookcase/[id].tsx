import { ButtonIcon, Button, ButtonText } from "@/components/ui/button";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SnapbackZoom } from "react-native-zoom-toolkit";
import { Text } from "@/components/ui/text";
import { getBookcaseShareLink } from "@/api";
import { BookCase } from "@/models/book";
import {
  router,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Dimensions } from "react-native";
import { ImageBackground, Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowRightIcon } from "@/components/ui/icon";

export default function SharedBookcase() {
  const { id: shortCode } = useLocalSearchParams();
  const navigation = useNavigation();
  const [bookCase, setBookCase] = useState<{
    bookcase: BookCase;
    image_url: string;
    wallpaper_url?: string;
  }>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check out my bookcase: https://api.cosy-case.click/shared-bookcase/876b36
    const init = async () => {
      try {
        if (!shortCode) {
          console.error("No shortCode provided for shared bookcase.");
          return;
        }

        setLoading(true);
        const res = await getBookcaseShareLink(shortCode as string);
        setBookCase(res);
        // console.log("Shared bookcase link:", res);
        // update the title of the header to case name
        if (res?.bookcase?.name) {
          navigation.setOptions({
            title: res.bookcase.name,
          });
        }
      } catch (error) {
        console.error("Error fetching shared bookcase:", error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [shortCode]);

  const renderContent = () => {
    if (!bookCase) {
      return null;
    }

    return (
      <View className="flex-1 items-center justify-center">
        <GestureHandlerRootView>
          <SnapbackZoom>
            <View className="flex-1 gap-10">
              <Image
                source={{ uri: bookCase.image_url }}
                style={{
                  width: Dimensions.get("window").width - 20,
                  height: Dimensions.get("window").height / 1.5,
                }}
                contentFit="contain"
                transition={200}
                alt="Bookcase Image"
                className="mb-4"
              />
              <Button
                className="bg-white rounded-lg"
                onPress={() => {
                  router.push({
                    pathname: "/book-list",
                    params: {
                      books: JSON.stringify(bookCase.bookcase.books),
                    },
                  });
                }}
                style={{
                  width: Dimensions.get("window").width - 40,
                  alignSelf: "center",
                }}
                size="xl"
              >
                <ButtonText>
                  <Text>View Contents</Text>
                </ButtonText>
                <ButtonIcon as={ArrowRightIcon} color="black" />
              </Button>
            </View>
          </SnapbackZoom>
        </GestureHandlerRootView>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.permissionContainer}>
        <ActivityIndicator size="large" />
        <Text size="lg" style={styles.message}>
          Loading Bookcase...
        </Text>
      </View>
    );
  }

  return (
    <>
      {bookCase?.wallpaper_url ? (
        <ImageBackground
          source={{
            uri: bookCase.wallpaper_url || "",
          }}
          style={{
            backgroundColor: "transparent",
            width: Dimensions.get("window").width,
            flex: 1,
          }}
          resizeMode="cover"
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0.5)"]}
            style={{
              ...StyleSheet.absoluteFillObject,
              justifyContent: "center",
              alignItems: "center",
            }}
          />
          {renderContent()}
        </ImageBackground>
      ) : (
        renderContent()
      )}
    </>
  );
}

const styles = StyleSheet.create({
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    marginTop: 12,
  },
});
