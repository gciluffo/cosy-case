import React, { useEffect } from "react";
import { Dimensions, Platform } from "react-native";
import {
  Canvas,
  Rect,
  Group,
  BoxShadow,
  Image,
  useImage,
} from "@shopify/react-native-skia";
import useStore from "@/store";
import { Book, isPlaceHolderSpine } from "@/models/book";
import SkiaBookSpine from "@/components/SkiaBookSpine";

const SHELF_WIDTH = Dimensions.get("window").width * 0.95;
const SHELF_HEIGHT = Dimensions.get("window").height * 0.8;
const SHELF_SPACING = (SHELF_HEIGHT + 10) / 5;
const SHELF_THICKNESS = 20;

// Wood color palette with Skia-friendly colors
const WOOD_COLORS = {
  oak: "#C19A6B",
  maple: "#E6C229",
  walnut: "#653E27",
  pine: "#D6B380",
};

// Book interface

// Bookshelf component using Skia
const SkiaBookshelf: React.FC<{
  woodType?: keyof typeof WOOD_COLORS;
  shelves: Book[][];
}> = ({ woodType = "oak", shelves }) => {
  // Screen dimensions
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
    Dimensions.get("window");

  // Shelf configuration
  const NUM_SHELVES = shelves.length;

  // Load font from a valid font file
  // Render individual book spine
  const renderBookSpines = (shelfBooks: Book[], shelfY: number) => {
    return shelfBooks.map((book, index) => {
      const spine = book.spines.find((s) => s.selected);
      const spineWidth = spine?.width || 40;
      const spineHeight = spine?.height || 100;
      const spineColor = isPlaceHolderSpine(spine!)
        ? (spine as any).primaryColor
        : "#FFFFFF";
      const spineImage = isPlaceHolderSpine(spine!)
        ? null
        : spine?.imageUrl || null;
      const image = useImage(spineImage || "");
      const xPosition = 20 + index * (spineWidth + 5);
      // const image = useImage(require("../../assets/images/spine_example.jpeg"));

      return (
        <Group key={book.key}>
          {/* Book Spine */}
          {/* {isPlaceHolderSpine(spine!) ? (
            <SkiaBookSpine
              primaryColor={spineColor}
              title={spine.title}
              author={spine.author}
              width={spineWidth}
              height={100}
              x={xPosition}
              y={shelfY - 100}q
            />
          ) : (
            <Image
              x={xPosition}
              y={shelfY - 100}
              width={spineWidth}
              height={100}
              fit="cover"
              image={image}
            />
          )} */}
          <Rect
            x={xPosition}
            y={shelfY - 100}
            width={spineWidth}
            height={100}
            color={"black"}
          />
        </Group>
      );
    });
  };

  return (
    <Canvas style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}>
      {/* Multiple Shelves */}
      {shelves.map((shelfBooks, index) => {
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
  const [shelves, setShelves] = React.useState<Book[][]>([]);
  const { books } = useStore();

  useEffect(() => {
    // listof books ins tore.
    // calculate how many books per shelf. Bookwidth + spacing + shelfwidth
    // iterate through books. keep track of total shelf width, if total shelf width is greater than shelf width, create a new shelf and add the book to that shelf.
    if (books.length === 0) {
      setShelves([]);
      return;
    }

    const tempShelves: Book[][] = [[], [], [], [], []];
    let currentShelfWidth = 0;
    let currentShelfIndex = 0;
    for (const book of books) {
      const spine = book.spines.find((s) => s.selected);
      const { width, height } = spine || { width: 40, height: 100 };
      const bookWidth = width + 5; // Add spacing

      if (currentShelfWidth + bookWidth < SHELF_WIDTH) {
        tempShelves[currentShelfIndex].push(book);
        currentShelfWidth += bookWidth;
      } else {
        // If starting a new shelf, reset the width
        currentShelfIndex++;
        currentShelfWidth = bookWidth;
        tempShelves[currentShelfIndex].push(book);
      }
    }

    setShelves(tempShelves);
  }, []);

  console.log("Shelves:", shelves);

  return <SkiaBookshelf shelves={shelves} woodType="walnut" />;
};

export default BookshelfScreen;
