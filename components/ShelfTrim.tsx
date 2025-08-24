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
}

export function ShelfTrim(props: ShelfProps) {
  const { trimImageKey, width } = props;

  return (
    <ImageBackground
      source={ShelfImageMap[trimImageKey]}
      style={{
        width,
        justifyContent: "center",
        height: moderateScale(20),
      }}
      resizeMode="stretch"
    ></ImageBackground>
  );
}
