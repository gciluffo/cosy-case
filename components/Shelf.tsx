import { BookCase } from "@/models/book";
import { ImageBackground } from "expo-image";
import React from "react";

// @ts-ignore
import BirchTop from "@/assets/images/book-shelves/top-shelf-birch.png";
// @ts-ignore
import BirchMiddle from "@/assets/images/book-shelves/middle-shelf-birch.png";
// @ts-ignore
import BirchBottom from "@/assets/images/book-shelves/bottom-shelf-birch.png";
// @ts-ignore
import BirchWhiteTop from "@/assets/images/book-shelves/top-white-birch.png";
// @ts-ignore
import BirchWhiteMiddle from "@/assets/images/book-shelves/middle-white-birch.png";
// @ts-ignore
import BirchWhiteBottom from "@/assets/images/book-shelves/bottom-white-birch.png";
// @ts-ignore
import { View } from "react-native";

export const ShelfImageMap = {
  //birch
  birchTop: BirchTop,
  birchMiddle: BirchMiddle,
  birchBottom: BirchBottom,
  //white-trim
  birchWhiteTop: BirchWhiteTop,
  birchWhiteMiddle: BirchWhiteMiddle,
  birchWhiteBottom: BirchWhiteBottom,
};

interface ShelfProps {
  index: number;
  bookCase: BookCase;
  width: number;
  height: number;
  numShelves: number;
  children: React.ReactNode;
}

export function Shelf(props: ShelfProps) {
  const { children, index, numShelves, width, height, bookCase } = props;
  const {
    middleShelfImageKey: middleImageKey,
    topShelfImageKey: topImageKey,
    bottomShelfImageKey: bottomImageKey,
    bookOffsetXPercent,
    bookOffsetYPercent,
  } = bookCase;

  const horizontalPadding = width * bookOffsetXPercent;
  const verticalPadding = height * bookOffsetYPercent;

  const getShelfImage = (index: number, length: number) => {
    if (index === 0) {
      return (ShelfImageMap as any)[topImageKey];
    }
    if (index === length - 1) {
      return (ShelfImageMap as any)[bottomImageKey];
    }
    return (ShelfImageMap as any)[middleImageKey];
  };

  return (
    <ImageBackground
      source={getShelfImage(index, numShelves)}
      style={{
        height,
        width,
        paddingHorizontal: horizontalPadding,
        paddingVertical: verticalPadding,
        justifyContent: "center",
        marginVertical: -0.5,
      }}
      resizeMode="stretch"
    >
      <View style={{ flex: 1, justifyContent: "flex-end" }}>{children}</View>
    </ImageBackground>
  );
}
