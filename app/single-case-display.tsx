import React from "react";
import useStore from "@/store";
import { useLocalSearchParams } from "expo-router";
import FullScreenBookshelfComponent from "@/components/FullScreenBookShelf";
import { ImageBackground } from "expo-image";
import { Dimensions, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const BookshelfScreen = () => {
  const params = useLocalSearchParams();
  const { caseName } = params;
  const { getCaseByName } = useStore();

  const bookcase = getCaseByName(caseName as string);

  if (!bookcase) {
    return null;
  }

  // return <FullScreenBookshelfComponent bookcase={bookcase} />

  return (
    <>
      {bookcase.wallPaper?.url ? (
        <ImageBackground
          source={{
            uri: bookcase.wallPaper?.url || "",
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
          <FullScreenBookshelfComponent bookcase={bookcase} />
        </ImageBackground>
      ) : (
        <FullScreenBookshelfComponent bookcase={bookcase} />
      )}
    </>
  );
};

export default BookshelfScreen;
