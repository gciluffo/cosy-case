import React, { useEffect } from "react";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import useStore from "@/store";
import { Book } from "@/models/book";
import { ImageBackground } from "expo-image";
import { scale, verticalScale } from "@/utils/scale";
import CachedImage from "@/components/ChachedImage";
import { getBookHeightPx, getBookSpineWidth } from "@/utils/books";

const SHELF_WIDTH = Dimensions.get("window").width * 0.95;
const SHELF_HEIGHT = Dimensions.get("window").height * 0.8;
const SHELF_VERTICAL_OFFSET = verticalScale(20);
const SHELF_HORIZONTAL_OFFSET = scale(30);
const INDIVIDUAL_SHELF_HEIGHT = 120;

interface BookShelfProps {
  shelves: Book[][];
  shelfConfig: {
    topUri: string;
    middleUri: string;
    bottomUri: string;
    offset: {
      x: number;
      y: number;
    };
  };
}

interface BookSpineProps {
  book: Book & { width: number; height: number };
}

const BookSpine = (props: BookSpineProps) => {
  const { book } = props;
  const { width, height } = book;
  const spine = book.spines.find((s) => s.selected);

  if (book.title.toLowerCase() === "the blind side") {
    console.log("THE SPINE", spine);
  }

  if (!spine?.cacheKey) {
    return null;
  }

  return (
    <CachedImage
      source={{
        uri: "",
      }}
      cacheKey={spine.cacheKey}
      style={{
        // backgroundColor: "red",
        width: width,
        height: height,
        borderRadius: 1,
      }}
    />
  );
};

// Bookshelf component using Skia
const Bookshelf: React.FC<BookShelfProps> = ({ shelves, shelfConfig }) => {
  const { topUri, middleUri, bottomUri, offset } = shelfConfig;

  const getShelfImage = (index: number, length: number) => {
    if (index === 0) {
      return topUri;
    }
    if (index === length - 1) {
      return bottomUri;
    }
    return middleUri;
  };

  return (
    <View className="flex-1 items-center justify-center">
      {shelves.map((shelfBooks, index) => {
        return (
          <ImageBackground
            source={getShelfImage(index, shelves.length)}
            style={styles.shelfBackground}
            resizeMode="stretch"
          >
            <FlatList
              horizontal
              data={shelfBooks}
              keyExtractor={(item) => item.key}
              renderItem={({ item }: { item: any }) => {
                return <BookSpine book={item} key={item.key} />;
              }}
              contentContainerStyle={{
                marginHorizontal: offset.x,
                marginVertical: offset.y,
              }}
              showsHorizontalScrollIndicator={false}
            />
          </ImageBackground>
        );
      })}
    </View>
  );
};

// Example Usage
const BookshelfScreen = () => {
  const [shelves, setShelves] = React.useState<Book[][]>([]);
  const { books } = useStore();

  // const books: any[] = [
  //   {
  //     details: {
  //       number_of_pages: 200,
  //     },
  //   },
  //   {
  //     details: {
  //       number_of_pages: 1000,
  //     },
  //   },
  //   {
  //     details: {
  //       number_of_pages: 380,
  //     },
  //   },
  //   {
  //     details: {
  //       number_of_pages: 910,
  //     },
  //   },
  //   {
  //     details: {
  //       number_of_pages: 220,
  //     },
  //   },
  //   {
  //     details: {
  //       number_of_pages: 291,
  //     },
  //   },
  //   {
  //     details: {
  //       number_of_pages: 50,
  //     },
  //   },
  //   {
  //     details: {
  //       number_of_pages: 90,
  //     },
  //   },
  // ];

  useEffect(() => {
    // TODO: Move to shelf config
    const tempShelves: (Book & {
      width: number;
      height: number;
    })[][] = [];

    // Initialize shelves
    let totalShelfHeight = 0;
    while (totalShelfHeight < SHELF_HEIGHT) {
      tempShelves.push([]);
      totalShelfHeight += verticalScale(INDIVIDUAL_SHELF_HEIGHT);
    }

    let currentShelfWidth = SHELF_HORIZONTAL_OFFSET * 2;
    let currentShelfIndex = 0;
    for (const book of books) {
      const spine = book.spines.find((s) => s.selected);

      if (!spine) {
        continue;
      }

      const { originalImageHeight, originalImageWidth } = spine;
      const height = book.details?.physical_dimensions
        ? getBookHeightPx(
            book.details.physical_dimensions,
            INDIVIDUAL_SHELF_HEIGHT - SHELF_VERTICAL_OFFSET + 17
          )
        : INDIVIDUAL_SHELF_HEIGHT - SHELF_VERTICAL_OFFSET + 17;
      const width = getBookSpineWidth(
        book.details?.number_of_pages || 200,
        originalImageWidth || 80,
        originalImageHeight || 200,
        height
      );
      const bookWidth = width;

      const bookWithDimensions = {
        ...book,
        width,
        height,
      };

      if (currentShelfWidth + bookWidth < SHELF_WIDTH) {
        tempShelves[currentShelfIndex].push(bookWithDimensions);
        currentShelfWidth += bookWidth;
      } else {
        // If starting a new shelf, reset the width
        currentShelfIndex++;
        currentShelfWidth = bookWidth;
        tempShelves[currentShelfIndex].push(bookWithDimensions);
      }
    }

    setShelves(tempShelves);
  }, [books]);

  return (
    <Bookshelf
      shelves={shelves}
      shelfConfig={{
        topUri: require("../../assets/images/top-shelf-birch.png"),
        middleUri: require("../../assets/images/middle-shelf-birch.png"),
        bottomUri: require("../../assets/images/bottom-shelf-birch.png"),
        offset: {
          x: SHELF_HORIZONTAL_OFFSET,
          y: SHELF_VERTICAL_OFFSET,
        },
      }}
    />
  );
};

const styles = StyleSheet.create({
  shelfBackground: {
    // TODO: Refactor this when we add a flating navbar
    height: verticalScale(INDIVIDUAL_SHELF_HEIGHT),
    width: SHELF_WIDTH + 10,
  },
});

export default BookshelfScreen;
