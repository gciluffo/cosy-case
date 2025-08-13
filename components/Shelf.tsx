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
import WhiteTrimTop from "@/assets/images/book-shelves/top-white-trim.png";
// @ts-ignore
import WhiteTrimMiddle from "@/assets/images/book-shelves/middle-white-trim.png";
// @ts-ignore
import WhiteTrimBottom from "@/assets/images/book-shelves/bottom-white-trim.png";
import { View } from "react-native";

export const ShelfImageMap = {
  //birch
  birchTop: BirchTop,
  birchMiddle: BirchMiddle,
  birchBottom: BirchBottom,
  //white-trim
  whiteTrimTop: WhiteTrimTop,
  whiteTrimMiddle: WhiteTrimMiddle,
  whiteTrimBottom: WhiteTrimBottom,
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
    middleImageKey,
    topImageKey,
    bottomImageKey,
    bookOffsetXPercent: offsetXPercent,
    bookOffsetYPercent: offsetYPercent,
  } = bookCase;

  const horizontalPadding = width * offsetXPercent;
  const verticalPadding = height * offsetYPercent;

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
      }}
      resizeMode="stretch"
    >
      {/* This makes sure books align well inside shelf */}
      <View style={{ flex: 1, justifyContent: "flex-end" }}>{children}</View>
    </ImageBackground>
  );
}
