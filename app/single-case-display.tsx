import React, { useEffect } from "react";
import { SnapbackZoom } from "react-native-zoom-toolkit";
import { Dimensions, StyleSheet, View } from "react-native";
import useStore from "@/store";
import { Book, BookCase, isBook, Widget } from "@/models/book";
import { isTablet, scale, verticalScale } from "@/utils/scale";
import { getBookSpineWidth } from "@/utils/books";
import { Shelf } from "@/components/Shelf";
import CachedBookSpine from "@/components/BookSpine";
import CachedWidget from "@/components/Widget";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ImageBackground } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";

const MAX_WIDTH = Dimensions.get("window").width * (isTablet ? 0.8 : 0.95);
const MAX_HEIGHT = Dimensions.get("window").height * (isTablet ? 1.5 : 0.8);
const INDIVIDUAL_SHELF_HEIGHT = verticalScale(isTablet ? 80 : 110);

interface BookShelfProps {
  shelves: (Book | Widget)[][];
  bookCase: BookCase;
}

// Bookshelf component using Skia
const Bookshelf = (props: BookShelfProps) => {
  const { shelves, bookCase } = props;
  const wallPaper = bookCase.wallPaper;

  const renderContent = () => {
    return (
      <GestureHandlerRootView>
        <SnapbackZoom>
          <View className="flex-1 items-center justify-center">
            {shelves.map((shelfBooks, index) => {
              return (
                <Shelf
                  key={index}
                  index={index}
                  bookCase={bookCase}
                  width={MAX_WIDTH + 10}
                  height={INDIVIDUAL_SHELF_HEIGHT}
                  numShelves={shelves.length}
                >
                  <View
                    style={{ flexDirection: "row", alignItems: "flex-end" }}
                  >
                    {shelfBooks.map((item: any) => {
                      if ("spines" in item) {
                        return <CachedBookSpine book={item} key={item.key} />;
                      } else {
                        return (
                          <CachedWidget widget={item} key={item.cacheKey} />
                        );
                      }
                    })}
                  </View>
                </Shelf>
              );
            })}
          </View>
        </SnapbackZoom>
      </GestureHandlerRootView>
    );
  };

  return (
    <>
      {wallPaper?.url ? (
        <ImageBackground
          source={{
            uri: wallPaper?.url || "",
          }}
          style={{
            backgroundColor: "transparent",
            width: Dimensions.get("window").width,
            flex: 1,
          }}
          resizeMode="cover"
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0.5)"]}
            style={{
              ...StyleSheet.absoluteFillObject,
              justifyContent: "center",
              alignItems: "center",
            }}
          />
          {renderContent()}
        </ImageBackground>
      ) : (
        renderContent()
      )}
    </>
  );
};

interface DisplayCase {
  shelves: (Book | Widget)[][];
  bookCase: BookCase;
}

const BookshelfScreen = () => {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const { caseName } = params;
  const { getCaseByName } = useStore();
  const [displayCase, setDisplayCase] = React.useState<DisplayCase | null>(
    null
  );

  useEffect(() => {
    if (!caseName) {
      return;
    }

    // set header title to caseName
    navigation.setOptions({
      title: caseName as string,
    });

    const selectedCase = getCaseByName(caseName as string);

    if (!selectedCase) {
      return;
    }

    const selectedBookCaseClone = { ...selectedCase };
    const books = selectedBookCaseClone.books;
    const widgets = [...selectedBookCaseClone.widgets]; // Make a shallow copy

    const offsetX = scale(30);
    const offsetY = verticalScale(20);
    const tempShelves: ((Book | Widget) & {
      width: number;
      height: number;
    })[][] = [];

    // Initialize shelves
    let totalShelfHeight = 0;
    while (
      totalShelfHeight <
      MAX_HEIGHT - verticalScale(INDIVIDUAL_SHELF_HEIGHT)
    ) {
      tempShelves.push([]);
      totalShelfHeight += verticalScale(INDIVIDUAL_SHELF_HEIGHT);
    }

    let currentShelfWidth = offsetX;
    let currentShelfIndex = 0;

    // Insert widgets into the books array, even if there are less than 10 books
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

    booksWithWidgets.forEach((bookOrWidget, index) => {
      // console.log("Processing item", index, bookOrWidget);
      let width, height;
      if (isBook(bookOrWidget)) {
        const spine = bookOrWidget.spines.find((s) => s.selected);

        if (!spine) {
          // skip
          return;
        }

        const { originalImageHeight, originalImageWidth } = spine;
        const randomHeightOffset = Math.random() * 5; // Random offset for height variation
        height = INDIVIDUAL_SHELF_HEIGHT - offsetY - randomHeightOffset;
        // sort of a hack
        if (!isTablet) {
          height = height - verticalScale(5);
        }
        width = getBookSpineWidth(
          bookOrWidget?.number_of_pages || 200,
          originalImageWidth || 80,
          originalImageHeight || 200,
          height
        );
      } else {
        width = scale(60);
        height = INDIVIDUAL_SHELF_HEIGHT - offsetY - 20;
      }

      const thingWithDimensions = {
        ...bookOrWidget!,
        width,
        height,
      };

      if (currentShelfWidth + width < MAX_WIDTH - offsetX) {
        tempShelves[currentShelfIndex].push(thingWithDimensions);
        currentShelfWidth += width;
      } else {
        // If starting a new shelf, reset the width
        currentShelfIndex++;
        currentShelfWidth = width;
        tempShelves[currentShelfIndex].push(thingWithDimensions);
      }
    });

    setDisplayCase({
      shelves: tempShelves,
      bookCase: selectedBookCaseClone,
    });
  }, [caseName]);

  return (
    <>
      {displayCase && (
        <Bookshelf
          shelves={displayCase.shelves}
          bookCase={displayCase.bookCase}
        />
      )}
    </>
  );
};

export default BookshelfScreen;
