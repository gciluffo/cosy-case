import { Book, BookCase, isBook, Widget } from "@/models/book";
import { getBookHeightPx, getBookSpineWidth } from "@/utils/books";
import { scale, verticalScale } from "@/utils/scale";
import { ImageBackground } from "expo-image";
import React, { useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Shelf } from "./Shelf";
import CachedBookSpine from "./BookSpine";
import CachedWidget from "./Widget";

interface BookShelfProps {
  bookCase: BookCase;
  caseHeight: number;
  caseWidth: number;
  shelfHeight: number;
}

export default function CompactBookShelf(props: BookShelfProps) {
  const [shelves, setShelves] = React.useState<(Book | Widget)[][]>([]);
  const { bookCase, caseHeight, caseWidth, shelfHeight } = props;
  const { books, widgets } = bookCase;

  const offsetX = scale(30);
  const offsetY = verticalScale(20);

  useEffect(() => {
    const tempShelves: ((Book | Widget) & {
      width: number;
      height: number;
    })[][] = [];

    // Initialize shelves
    let totalShelfHeight = 0;
    while (totalShelfHeight < caseHeight) {
      tempShelves.push([]);
      totalShelfHeight += shelfHeight;
    }

    let currentShelfWidth = offsetX - 20;
    let currentShelfIndex = 0;

    const booksWithWidgets: (Book | Widget)[] = [...books];
    if (widgets && widgets.length > 0) {
      const widgetsCopy = [...widgets];
      if (booksWithWidgets.length < 10) {
        // Place all widgets at the end if less than 10 books
        booksWithWidgets.push(...widgetsCopy);
      } else {
        // Insert widgets every 10 books
        let insertIndex = 10;
        while (
          widgetsCopy.length > 0 &&
          insertIndex <= booksWithWidgets.length
        ) {
          booksWithWidgets.splice(insertIndex, 0, widgetsCopy.shift()!);
          insertIndex += 11; // Move to the next 10 books (10 books + 1 widget)
        }
        // If any widgets remain, append them at the end
        if (widgetsCopy.length > 0) {
          booksWithWidgets.push(...widgetsCopy);
        }
      }
    }

    for (const bookOrWidget of booksWithWidgets) {
      let width, height;
      if (isBook(bookOrWidget)) {
        const spine = bookOrWidget.spines.find((s) => s.selected);

        if (!spine) {
          continue;
        }
        const { originalImageHeight, originalImageWidth } = spine;
        height = bookOrWidget?.physical_dimensions
          ? getBookHeightPx(
              bookOrWidget?.physical_dimensions,
              shelfHeight - offsetY + 15
            )
          : shelfHeight - offsetY + 15;
        width = getBookSpineWidth(
          bookOrWidget?.number_of_pages || 200,
          originalImageWidth || 80,
          originalImageHeight || 200,
          height
        );
      } else {
        width = scale(20);
        height = shelfHeight - offsetY + 15;
      }

      const bookWithDimensions = {
        ...bookOrWidget!,
        width,
        height,
      };

      if (currentShelfWidth + width < caseWidth) {
        tempShelves[currentShelfIndex].push(bookWithDimensions);
        currentShelfWidth += width;
      } else {
        // If starting a new shelf, reset the width
        currentShelfIndex++;
        currentShelfWidth = width;
        tempShelves[currentShelfIndex].push(bookWithDimensions);
      }
    }

    setShelves(tempShelves);
  }, [bookCase]);

  return (
    <>
      {shelves.map((shelfBooks, index) => {
        return (
          <Shelf
            key={index}
            index={index}
            bookCase={bookCase}
            width={caseWidth}
            height={shelfHeight}
            numShelves={shelves.length}
          >
            <View style={{ flexDirection: "row" }}>
              {shelfBooks.map((book: any) => {
                if ("spines" in book) {
                  return <CachedBookSpine book={book} key={book.key} />;
                } else {
                  return <CachedWidget widget={book} />;
                }
              })}
            </View>
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
