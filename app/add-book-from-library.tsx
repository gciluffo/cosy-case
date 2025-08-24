import ScrollViewFloatingButton from "@/components/ScrollViewFloatingButton";
import { Image } from "expo-image";
import { Book } from "@/models/book";
import useStore from "@/store";
import { isTablet, moderateScale, scale } from "@/utils/scale";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, View, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/build/FontAwesome";

export default function AddBookFromLibrary() {
  const params = useLocalSearchParams();
  const { caseName } = params;
  const { addBooksToCase, getCaseByName, cases } = useStore();
  const bookCase = getCaseByName(caseName as string);
  const [selectedBooks, setSelectedBooks] = useState<
    (Book & { isSelected: boolean })[]
  >([]);

  useEffect(() => {
    if (!bookCase) {
      return;
    }

    const books = cases.reduce((acc, bookCase) => {
      const books = bookCase.books.map((book) => ({
        ...book,
        key: book.key,
      }));
      return [...acc, ...books];
    }, [] as Book[]);
    const uniqueBooks = books.filter(
      (book, index, self) => self.findIndex((b) => b.key === book.key) === index
    );

    // remove books that are already in this case
    const booksInCase = bookCase.books.map((book) => book.key);
    const filteredBooks = uniqueBooks.filter(
      (book) => !booksInCase.includes(book.key)
    );

    const selectedBooks = filteredBooks.map((book) => ({
      ...book,
      isSelected: false,
    }));
    setSelectedBooks(selectedBooks);
  }, [cases]);

  const onAddToLibrary = () => {
    const booksToAdd = selectedBooks.filter((book) => book.isSelected);
    if (booksToAdd.length === 0) {
      return;
    }
    addBooksToCase(bookCase!.name, booksToAdd);
    setSelectedBooks((prev) =>
      prev.map((book) => ({ ...book, isSelected: false }))
    );
    router.back();
  };

  return (
    <ScrollViewFloatingButton
      onPress={() => onAddToLibrary()}
      buttonText="Add to Library"
      disabled={selectedBooks.filter((book) => book.isSelected).length === 0}
    >
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          paddingBottom: 100,
        }}
      >
        {selectedBooks.map((item) => (
          <TouchableOpacity
            key={item.key}
            className="rounded-lg p-2"
            onPress={() => {
              setSelectedBooks((prev) => {
                const newBooks = prev.map((book) => {
                  if (book.key === item.key) {
                    return {
                      ...book,
                      isSelected: !book.isSelected,
                    };
                  }
                  return book;
                });
                return newBooks;
              });
            }}
          >
            <View style={{ position: "relative", marginBottom: 10 }}>
              <Image
                source={{ uri: item.cover_url }}
                className="rounded-lg"
                style={styles.image}
                contentFit="fill"
              />
              {item.isSelected && (
                <View
                  style={{
                    ...StyleSheet.absoluteFillObject,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    borderRadius: 10,
                  }}
                >
                  <FontAwesome
                    name="check-circle"
                    size={25}
                    color="white"
                    style={{
                      width: scale(30),
                      height: scale(30),
                      position: "absolute",
                      top: "90%",
                      left: "90%",
                      transform: [{ translateX: -15 }, { translateY: -15 }],
                    }}
                  />
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollViewFloatingButton>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  image: {
    width: scale(90),
    height: scale(130),
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bookIsSelected: {
    backgroundColor: "red",
    zIndex: 3,
  },
});
