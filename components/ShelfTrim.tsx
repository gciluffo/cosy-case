import { ImageBackground } from "expo-image";
import React from "react";

// @ts-ignore
import BirchWhiteBottomTrim from "@/assets/images/book-shelves/bottom-trim-white-birch.png";
import { moderateScale } from "@/utils/scale";

export const ShelfImageMap = {
  birchWhiteBottomTrim: BirchWhiteBottomTrim,
};

interface ShelfProps {
  trimImageKey: keyof typeof ShelfImageMap;
  width: number;
  height?: number;
}

export function ShelfTrim(props: ShelfProps) {
  const { trimImageKey, width, height } = props;

  return (
    <ImageBackground
      source={ShelfImageMap[trimImageKey]}
      style={{
        width,
        justifyContent: "center",
        height: height ? moderateScale(height) : moderateScale(20),
      }}
      resizeMode="stretch"
    ></ImageBackground>
  );
}
