import { View, StyleSheet } from "react-native";
import { Text } from "@/components/ui/text";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import useStore from "@/store";
import { useLocalSearchParams } from "expo-router";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { getPrimaryAndSecondaryColors } from "@/utils/image";
import { scale, verticalScale } from "@/utils/scale";
import { Heading } from "@/components/ui/heading";
import { LinearGradient } from "expo-linear-gradient";
import { isColorDark } from "@/utils/color";
import { AddIcon, TrashIcon } from "@/components/ui/icon";
import { CacheManager } from "@/components/ChachedImage";

export default function BookDetails() {
  const [coverColors, setColorCovers] = useState<{
    primary: string;
    secondary: string;
  } | null>(null);
  const { removeBook, getBookByKey } = useStore();
  const params = useLocalSearchParams();
  const { bookKey } = params;
  const book = getBookByKey(bookKey as string);

  // TODO: Remove
  useEffect(() => {
    const bookSpinePrimaryColorInit = async () => {
      if (!book?.cover_url) {
        return;
      }

      try {
        const colors = await getPrimaryAndSecondaryColors(book.cover_url);
        // console.log("Primary color:", color);
        setColorCovers(colors);
      } catch (error) {}
    };

    bookSpinePrimaryColorInit();
  }, [book]);

  const removeFromLibrary = () => {
    // remove all assets on file
    const cacheKeys = book?.spines.map((item) => item.cacheKey);
    if (cacheKeys?.length) {
      cacheKeys.forEach((key) => {
        CacheManager.removeFromCache({ key });
      });
    }
    removeBook(bookKey as string);
  };

  return (
    <ParallaxScrollView
      parallaxHeaderHeight={300}
      parallaxHeaderContent={() => (
        <>
          <LinearGradient
            colors={
              coverColors
                ? [coverColors?.primary, coverColors?.secondary]
                : ["#ffffff", "#ffffff"]
            }
            style={{
              height: verticalScale(450),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              style={styles.image}
              source={book?.cover_url}
              contentFit="contain"
              transition={500}
            />
            <View className="justify-center items-center mt-2">
              <Heading
                size="xl"
                className={
                  isColorDark(coverColors?.primary || "#ffffff")
                    ? "color-typography-white"
                    : "color-typography-black"
                }
                style={{
                  textAlign: "center",
                }}
              >
                {book?.title}
              </Heading>
              <Text
                className={
                  isColorDark(coverColors?.primary || "#ffffff")
                    ? "color-typography-white"
                    : "color-typography-black"
                }
              >
                {book?.author_name?.join(", ")}
              </Text>
            </View>
            <View className="mt-10" />
            <Button
              onPress={removeFromLibrary}
              size="xl"
              style={{
                backgroundColor: isColorDark(coverColors?.primary || "#ffffff")
                  ? "#ffffff"
                  : "#000000",
                borderRadius: 10,
                padding: 10,
              }}
            >
              <ButtonIcon
                as={TrashIcon}
                color={
                  isColorDark(coverColors?.primary || "#ffffff")
                    ? "#000000"
                    : "#ffffff"
                }
              />
              <ButtonText>
                <Text
                  className={
                    isColorDark(coverColors?.primary || "#ffffff")
                      ? "color-typography-black"
                      : "color-typography-white"
                  }
                >
                  Remove from library
                </Text>
              </ButtonText>
            </Button>
          </LinearGradient>
        </>
      )}
    >
      <View style={styles.content}></View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: scale(150),
    height: scale(200),
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  content: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    height: "100%",
  },
});
