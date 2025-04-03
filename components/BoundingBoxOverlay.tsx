import React from "react";
import { StyleSheet } from "react-native";
import Svg, { Rect } from "react-native-svg";

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

const BoundingBoxOverlay = ({ boxes }: { boxes: Box[] }) => {
  return (
    <Svg style={StyleSheet.absoluteFill}>
      {boxes.map((box, index) => (
        <Rect
          key={index}
          x={box.x}
          y={box.y}
          width={box.width}
          height={box.height}
          stroke="red"
          strokeWidth="2"
          fill="transparent"
        />
      ))}
    </Svg>
  );
};

export default BoundingBoxOverlay;
