import React from "react";
import { Canvas, Rect, Text, useFont } from "@shopify/react-native-skia";
import { View } from "react-native";

interface BookSpineProps {
  colors: {
    primary: string;
    secondary: string;
  };
  title: string;
  author: string;
  width?: number;
  height?: number;
  canvasRef: React.RefObject<any>;
}

const SkiaBookSpine: React.FC<BookSpineProps> = ({
  title = "Unknown Title",
  author = "Unknown Author",
  width = 60,
  height = 250,
  colors,
  canvasRef,
}) => {
  const [loaded, setLoaded] = React.useState(false);
  const font = useFont(require("../assets/fonts/SpaceMono-Regular.ttf"), 12); // Load your own .ttf file

  React.useEffect(() => {
    if (font) {
      setLoaded(true);
    }
  }, [font]);

  if (!font || !loaded) {
    return null;
  }

  const padding = 2;
  const maxLineWidth = width - 2 * padding;
  const lineHeight = font.getSize() + 2;

  // Simple text wrapping function
  const wrapText = (text: string, maxWidth: number) => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (let word of words) {
      const testLine = currentLine.length ? `${currentLine} ${word}` : word;
      const { width: testWidth } = font.measureText(testLine);
      if (testWidth < maxWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  };

  const titleLines = wrapText(title, maxLineWidth);
  const authorLines = wrapText(author, maxLineWidth);
  const totalTextHeight = (titleLines.length + authorLines.length) * lineHeight;

  const startY = (height - totalTextHeight) / 2;

  return (
    <>
      {loaded && (
        <View style={{ width, height }}>
          <Canvas style={{ width, height }} ref={canvasRef}>
            <Rect
              x={0}
              y={0}
              width={width}
              height={height}
              color={colors.primary || "black"}
            />
            {[...titleLines, ...authorLines].map((line, i) => {
              const isTitle = i < titleLines.length;
              const adjustedY =
                startY + i * lineHeight + (isTitle ? 0 : lineHeight); // Add spacing before author lines
              return (
                <Text
                  key={i}
                  x={padding}
                  y={adjustedY}
                  text={line}
                  font={font}
                  color="white"
                />
              );
            })}
          </Canvas>
        </View>
      )}
    </>
  );
};

export default SkiaBookSpine;
