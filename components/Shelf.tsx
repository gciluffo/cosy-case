import { BookCase } from "@/models/book";
import { ImageBackground } from "expo-image";
import React from "react";

// @ts-ignore
import BirchTop from "@/assets/images/top-shelf-birch.png";
// @ts-ignore
import BirchMiddle from "@/assets/images/middle-shelf-birch.png";
// @ts-ignore
import BirchBottom from "@/assets/images/bottom-shelf-birch.png";
import { View } from "react-native";

const ShelfImageMap = {
  birchTop: BirchTop,
  birchMiddle: BirchMiddle,
  birchBottom: BirchBottom,
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
    offsetXPercent,
    offsetYPercent,
  } = bookCase;

  const horizontalPadding = width * offsetXPercent;
  const verticalPadding = height * offsetYPercent;

  const getShelfImage = (index: number, length: number) => {
    if (index === 0) {
      return (ShelfImageMap as any)[topImageKey];
    }
    if (index === length - 1) {
      return (ShelfImageMap as any)[middleImageKey];
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
