import React from "react";
import { Dimensions, Platform } from "react-native";
import {
  Canvas,
  Rect,
  Group,
  Text as SkiaText,
  useFont,
  BoxShadow,
  Image,
  useImage,
} from "@shopify/react-native-skia";

// Wood color palette with Skia-friendly colors
const WOOD_COLORS = {
  oak: "#C19A6B",
  maple: "#E6C229",
  walnut: "#653E27",
  pine: "#D6B380",
};

// Book interface
interface Book {
  id: string;
  title: string;
  author: string;
  spine?: {
    color: string;
    width: number;
  };
}

// Bookshelf component using Skia
const SkiaBookshelf: React.FC<{
  woodType?: keyof typeof WOOD_COLORS;
  books: Book[][];
}> = ({ woodType = "oak", books }) => {
  // Screen dimensions
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
    Dimensions.get("window");

  // Shelf configuration
  const SHELF_WIDTH = SCREEN_WIDTH * 0.95;
  const SHELF_HEIGHT = SCREEN_HEIGHT * 0.8;
  const NUM_SHELVES = books.length;
  const SHELF_SPACING = SHELF_HEIGHT / (NUM_SHELVES + 1);
  const SHELF_THICKNESS = 20;

  // Load font from a valid font file
  // Render individual book spine
  const renderBookSpines = (shelfBooks: Book[], shelfY: number) => {
    const font = useFont(
      require("../../assets/fonts/SpaceMono-Regular.ttf"),
      12
    );

    return shelfBooks.map((book, index) => {
      const spineWidth = book.spine?.width || 40;
      const spineColor = book.spine?.color || "#5D4037";
      const xPosition = 20 + index * (spineWidth + 5);
      const image = useImage(require("../../assets/images/spine_example.jpeg"));

      return (
        <Group key={book.id}>
          {/* Book Spine */}
          {/* <Rect
            x={xPosition}
            y={shelfY - 100}
            width={spineWidth}
            height={100}
            color={spineColor}
          /> */}
          <Image
            x={xPosition}
            y={shelfY - 100}
            width={spineWidth}
            height={100}
            fit="cover"
            color={spineColor}
            image={image}
          />

          {/* Book Title (if font is loaded) */}
          {/* {font && (
            <Group
              transform={[
                { translateX: xPosition + spineWidth / 2 },
                { translateY: shelfY - 40 },
                { rotate: -Math.PI / 2 },
              ]}
            >
              <SkiaText
                font={font}
                text={book.title}
                x={-font.measureText(book.title).width / 2} // Center text horizontally
                y={0}
                color="white"
                style="fill"
              />
            </Group>
          )} */}
        </Group>
      );
    });
  };

  return (
    <Canvas style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}>
      {/* Multiple Shelves */}
      {books.map((shelfBooks, index) => {
        const shelfY = SHELF_SPACING * (index + 1);

        return (
          <Group key={`shelf-${index}`}>
            {/* Shelf Background with Wood Texture */}
            <Rect
              x={(SCREEN_WIDTH - SHELF_WIDTH) / 2}
              y={shelfY}
              width={SHELF_WIDTH}
              height={SHELF_THICKNESS}
              color={WOOD_COLORS[woodType]}
            >
              {/* Add wood grain effect */}
              <BoxShadow inner blur={3} spread={1} color="rgba(0,0,0,0.1)" />
            </Rect>

            {/* Books on this shelf */}
            <Group>{renderBookSpines(shelfBooks, shelfY)}</Group>
          </Group>
        );
      })}
    </Canvas>
  );
};

// Example Usage
const BookshelfScreen = () => {
  const sampleBooks: Book[][] = [
    // First shelf
    [
      {
        id: "1",
        title: "Moby Dick",
        author: "Herman Melville",
        spine: {
          color: "#3E2723",
          width: 40,
        },
      },
      {
        id: "2",
        title: "Pride and Prejudice",
        author: "Jane Austen",
        spine: {
          color: "#4E342E",
          width: 35,
        },
      },
    ],
    // Second shelf
    [
      {
        id: "3",
        title: "1984",
        author: "George Orwell",
        spine: {
          color: "#212121",
          width: 45,
        },
      },
      {
        id: "4",
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        spine: {
          color: "#1B5E20",
          width: 38,
        },
      },
    ],
    // Third shelf
    [
      {
        id: "5",
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        spine: {
          color: "#3E2723",
          width: 42,
        },
      },
    ],
  ];

  return <SkiaBookshelf books={sampleBooks} woodType="oak" />;
};

export default BookshelfScreen;
