import React, { useEffect } from "react";
import { Dimensions, FlatList, View } from "react-native";
import useStore from "@/store";
import { Book, BookCase } from "@/models/book";
import { scale, verticalScale } from "@/utils/scale";
import { getBookHeightPx, getBookSpineWidth } from "@/utils/books";
import { Shelf } from "@/components/Shelf";
import BookSpine from "@/components/BookSpine";

const MAX_WIDTH = Dimensions.get("window").width * 0.95;
const MAX_HEIGHT = Dimensions.get("window").height * 0.8;
const INDIVIDUAL_SHELF_HEIGHT = 120;

interface BookShelfProps {
  shelves: Book[][];
  bookCase: BookCase;
}

// Bookshelf component using Skia
const Bookshelf = (props: BookShelfProps) => {
  const { shelves, bookCase } = props;
  // offsetXPercent: scale(30),
  // offsetYPercent: verticalScale(20),

  // console.log({
  //   shelfWidth: MAX_WIDTH,
  //   shelfHeight: INDIVIDUAL_SHELF_HEIGHT,
  // });

  return (
    <View className="flex-1 items-center justify-center">
      {shelves.map((shelfBooks, index) => {
        return (
          <Shelf
            key={index}
            index={index}
            bookCase={bookCase}
            width={MAX_WIDTH + 10}
            height={verticalScale(INDIVIDUAL_SHELF_HEIGHT)}
            numShelves={shelves.length}
          >
            <FlatList
              horizontal
              data={shelfBooks}
              keyExtractor={(item) => item.key}
              renderItem={({ item }: { item: any }) => {
                return <BookSpine book={item} key={item.key} />;
              }}
              contentContainerStyle={{ alignItems: "flex-end" }} // Makes sure spines align bottom
              showsHorizontalScrollIndicator={false}
              scrollEnabled={false}
            />
          </Shelf>
        );
      })}
    </View>
  );
};

const BookshelfScreen = () => {
  const [shelves, setShelves] = React.useState<Book[][]>([]);
  const { cases } = useStore();
  const selectedCase = cases.find((c) => c.isSelected);
  const books = selectedCase?.books || [];

  useEffect(() => {
    if (!selectedCase) {
      return;
    }

    // offsetXPercent: scale(30),
    // offsetYPercent: verticalScale(20),
    // const { offsetX, offsetY } = selectedCase;
    const offsetX = scale(30);
    const offsetY = verticalScale(20);
    const tempShelves: (Book & {
      width: number;
      height: number;
    })[][] = [];

    // Initialize shelves
    let totalShelfHeight = 0;
    while (totalShelfHeight < MAX_HEIGHT) {
      tempShelves.push([]);
      totalShelfHeight += verticalScale(INDIVIDUAL_SHELF_HEIGHT);
    }

    let currentShelfWidth = offsetX * 2;
    let currentShelfIndex = 0;
    for (const book of books) {
      const spine = book.spines.find((s) => s.selected);

      if (!spine) {
        continue;
      }

      const { originalImageHeight, originalImageWidth } = spine;
      // TODO: Look into how we want to do height here
      // const height = book?.physical_dimensions
      //   ? getBookHeightPx(
      //       book?.physical_dimensions,
      //       INDIVIDUAL_SHELF_HEIGHT - offsetY + 17
      //     )
      //   : INDIVIDUAL_SHELF_HEIGHT - offsetY + 17;
      const height = INDIVIDUAL_SHELF_HEIGHT - offsetY + 17;
      const width = getBookSpineWidth(
        book?.number_of_pages || 200,
        originalImageWidth || 80,
        originalImageHeight || 200,
        height
      );
      const bookWidth = width!;

      const bookWithDimensions = {
        ...book,
        width: bookWidth,
        height,
      };

      if (currentShelfWidth + bookWidth < MAX_WIDTH) {
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
  }, [selectedCase]);

  return (
    <>
      {selectedCase && <Bookshelf shelves={shelves} bookCase={selectedCase} />}
    </>
  );
};

export default BookshelfScreen;
