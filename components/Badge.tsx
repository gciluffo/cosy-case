import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { BadgeType } from "@/models/book";
import { ImageBackground } from "expo-image";
import React from "react";
import { useMemo } from "react";
import { Canvas, Group, Path, Skia } from "@shopify/react-native-skia";

type ProgressWheel = {
  size: number;
  strokeWidth?: number;
  progress: number;
  children?: React.ReactNode;
};

const ProgressWheel = ({
  size,
  progress,
  strokeWidth = 1,
  children,
}: ProgressWheel) => {
  const radius = size / 2 - strokeWidth / 2;

  const path = useMemo(() => {
    const skPath = Skia.Path.Make();

    skPath.addCircle(size / 2, size / 2, radius);

    return skPath;
  }, [radius, size]);

  const style = {
    width: size,
    height: size,
    zIndex: 100,
  };

  const origin = {
    x: size / 2,
    y: size / 2,
  };

  const transform = [
    {
      rotate: -Math.PI / 2,
    },
  ];

  return (
    <View
      style={[
        style,
        {
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        },
      ]}
    >
      <Canvas style={style}>
        <Group origin={origin} transform={transform}>
          <Path
            start={0}
            path={path}
            end={1}
            style={"stroke"}
            strokeCap={"round"}
            color={"lightgray"}
            strokeWidth={10}
          />
          <Path
            start={0}
            path={path}
            end={progress}
            style={"stroke"}
            strokeCap={"round"}
            color={"gold"}
            strokeWidth={10}
          />
        </Group>
      </Canvas>
      {children && (
        <View
          style={{
            position: "absolute",
            top: 15,
          }}
        >
          {children}
        </View>
      )}
    </View>
  );
};

interface BadgeProps {
  type: BadgeType;
  progress: number; // progress percentage, value of 1 is 100%
  hideProgress?: boolean;
  width?: number;
  height?: number;
}

export default function Badge(props: BadgeProps) {
  const { type, progress, width, height, hideProgress = true } = props;

  const getFilePathForBadge = (type: BadgeType) => {
    switch (type) {
      case BadgeType.FIRST_FINISHED_BOOK:
        return require("@/assets/images/badges/first_book_finished.png");
      case BadgeType.FIRST_SHARED_BOOK:
        return require("@/assets/images/badges/first_shared_shelf.jpeg");
      case BadgeType.FIVE_SCIFI_BOOKS_FINISHED:
        return require("@/assets/images/badges/5_scifi_books_finished.png");
      case BadgeType.FIVE_FANTASY_BOOKS_FINISHED:
        return require("@/assets/images/badges/5_fantasy_books_finished.png");
      case BadgeType.FIVE_NON_FICTION_BOOKS_FINISHED:
        return require("@/assets/images/badges/5_nonfiction_books_finished.png");
      case BadgeType.FIVE_ROMANCE_BOOKS_FINISHED:
        return require("@/assets/images/badges/5_romance_books_finished.png");
      case BadgeType.FIVE_MYSTERY_BOOKS_FINISHED:
        return require("@/assets/images/badges/5_mystery_books_finished.png");
      case BadgeType.FIVE_HORROR_BOOKS_FINISHED:
        return require("@/assets/images/badges/5_horror_books_finished.png");
      //   case BadgeType.FIVE_THRILLER_BOOKS_FINISHED:
      //     return require("@/assets/images/badges/5_thriller_books_finished.png");
      case BadgeType.FIFTEY_BOOKS_FINISHED:
        return require("@/assets/images/badges/finished_50_books.png");
    }
  };

  const size = width || 40;
  const radius = width ? width / 2 : 20;

  return (
    <ProgressWheel size={size} progress={progress} strokeWidth={10}>
      <ImageBackground
        source={getFilePathForBadge(type)}
        style={{
          width: size - radius / 2,
          height: size - radius / 2,
        }}
        className="rounded-full"
        imageStyle={progress < 1 ? { opacity: 0.6 } : undefined}
      />
    </ProgressWheel>
  );
}
