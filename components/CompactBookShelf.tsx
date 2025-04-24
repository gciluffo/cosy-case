import { Book, BookCase } from "@/models/book";
import { getBookHeightPx, getBookSpineWidth } from "@/utils/books";
import { scale, verticalScale } from "@/utils/scale";
import { ImageBackground } from "expo-image";
import React, { useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Shelf } from "./Shelf";
import BookSpine from "./BookSpine";

interface BookShelfProps {
  bookCase: BookCase;
  caseHeight: number;
  caseWidth: number;
  shelfHeight: number;
}

export default function CompactBookShelf(props: BookShelfProps) {
  const [shelves, setShelves] = React.useState<Book[][]>([]);
  const { bookCase, caseHeight, caseWidth, shelfHeight } = props;
  const { books } = bookCase;

  const offsetX = scale(30);
  const offsetY = verticalScale(20);

  //   console.log({ offsetX, offsetY, caseHeight, caseWidth, shelfHeight });

  useEffect(() => {
    const tempShelves: (Book & {
      width: number;
      height: number;
    })[][] = [];

    // Initialize shelves
    let totalShelfHeight = 0;
    while (totalShelfHeight < caseHeight) {
      tempShelves.push([]);
      totalShelfHeight += shelfHeight;
    }

    let currentShelfWidth = offsetX * 2;
    let currentShelfIndex = 0;
    for (const book of books) {
      const spine = book.spines.find((s) => s.selected);

      if (!spine) {
        continue;
      }

      const { originalImageHeight, originalImageWidth } = spine;
      const height = book?.physical_dimensions
        ? getBookHeightPx(book?.physical_dimensions, shelfHeight - offsetY + 17)
        : shelfHeight - offsetY + 17;
      const width = getBookSpineWidth(
        book?.number_of_pages || 200,
        originalImageWidth || 80,
        originalImageHeight || 200,
        height
      );
      // const bookWidth = originalImageWidth > 300 ? 300 : originalImageWidth;
      const bookWidth = width!;

      const bookWithDimensions = {
        ...book,
        width: bookWidth,
        height,
      };

      if (currentShelfWidth + bookWidth < caseWidth) {
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
  }, [bookCase]);

  const bookVerticalOffset = shelfHeight / caseHeight;
  const bookHorizontalOffset = caseWidth / shelfHeight;

  //   console.log({
  //     bookVerticalOffset,
  //     bookHorizontalOffset,
  //     shelfHeight,
  //     caseHeight,
  //     caseWidth,
  //   });

  return (
    <>
      {shelves.map((shelfBooks, index) => {
        return (
          <Shelf
            index={index}
            bookCase={bookCase}
            width={caseWidth}
            height={shelfHeight}
            numShelves={shelves.length}
          >
            <FlatList
              horizontal
              data={shelfBooks}
              keyExtractor={(item) => item.key}
              renderItem={({ item }: { item: any }) => {
                return <BookSpine book={item} key={item.key} />;
              }}
              // style={{
              //   marginHorizontal: bookHorizontalOffset,
              //   marginVertical: 5,
              // }}
              showsHorizontalScrollIndicator={false}
              scrollEnabled={false}
            />
          </Shelf>
        );
      })}
    </>
  );
}

// const styles = StyleSheet.create({
//   shelfBackground: {
//     // TODO: Refactor this when we add a flating navbar
//     height: verticalScale(INDIVIDUAL_SHELF_HEIGHT),
//     width: SHELF_WIDTH + 10,
//   },
// });
