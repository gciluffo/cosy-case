import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
} from "@/components/ui/actionsheet";
import useStore from "@/store";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { isTablet, moderateScale, scale } from "@/utils/scale";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Book, BookReview } from "@/models/book";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { getBookDescription } from "@/utils/books";
import BookReviewIcon from "@/components/BookReviewIcon";
import { captializeFirstLetter } from "@/utils/string";

export default function TabTwoScreen() {
  const [showActionsheet, setShowActionsheet] = useState(false);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const handleClose = () => setShowActionsheet(false);
  const { cases, user, updateUser } = useStore();

  const allBooks = useMemo(() => {
    const books = cases.reduce((acc, bookCase) => {
      return [...acc, ...bookCase.books];
    }, [] as Book[]);
    const uniqueBooks = books.filter(
      (book, index, self) => self.findIndex((b) => b.key === book.key) === index
    );

    return uniqueBooks;
  }, [cases]);

  useEffect(() => {
    if (!user.bookListFilter) {
      setFilteredBooks(allBooks);
      return;
    }

    const filtered = allBooks.filter(
      (book) => book.review === user.bookListFilter
    );
    setFilteredBooks(filtered);
  }, [user.bookListFilter, allBooks]);

  if (!allBooks || allBooks.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <Image
          source={require("@/assets/images/bored-rat.png")}
          style={{ width: scale(250), height: scale(250) }}
        />
        <Heading size={isTablet ? "2xl" : "xl"}>
          No books yet. Tap above to add some!
        </Heading>
      </View>
    );
  }

  return (
    <View>
      <View className="flex-row items-center pt-3 pl-3 pr-3 pb-2">
        <View className="flex-1 flex-row items-center gap-2">
          <TouchableOpacity
            onPress={() => {
              updateUser({ bookListDisplayMode: "list" });
            }}
          >
            <MaterialCommunityIcons
              name="view-list"
              size={30}
              color={user.bookListDisplayMode === "list" ? "#0a7ea4" : "grey"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              updateUser({ bookListDisplayMode: "grid" });
            }}
          >
            <MaterialCommunityIcons
              name="view-grid"
              size={24}
              color={user.bookListDisplayMode === "grid" ? "#0a7ea4" : "grey"}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => setShowActionsheet(true)}>
          <View className="flex-row flex-2">
            <Text
              className="mr-1"
              style={{
                fontWeight: 500,
                fontSize: moderateScale(12),
                color: "black",
              }}
            >
              {!user.bookListFilter
                ? `All(${filteredBooks.length})`
                : `${captializeFirstLetter(user.bookListFilter)}(${
                    filteredBooks.length
                  })`}
            </Text>
            <MaterialCommunityIcons name="sort" size={22} color="black" />
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          height: 1,
          backgroundColor: "lightgrey",
          width: "95%",
          alignSelf: "center",
        }}
      />
      <FlatList
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        style={styles.list}
        data={filteredBooks}
        numColumns={user.bookListDisplayMode === "grid" ? 3 : 1}
        key={user.bookListDisplayMode} // force re-render when switching modes
        ItemSeparatorComponent={() => <View style={{ marginVertical: 10 }} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="rounded-lg p-2 flex-row"
            onPress={() =>
              router.push({
                pathname: "/book-details",
                params: {
                  localBookKey: item.key,
                },
              })
            }
          >
            {item.cover_url ? (
              <View className="flex items-center">
                <Image
                  source={{ uri: item.cover_url }}
                  className="rounded-lg"
                  style={styles.image}
                  contentFit="contain"
                />
                {user.bookListDisplayMode === "grid" && (
                  <View className="mt-2">
                    <BookReviewIcon bookReview={item.review} />
                  </View>
                )}
              </View>
            ) : (
              <View style={{ ...styles.image, backgroundColor: "grey" }} />
            )}
            {user.bookListDisplayMode === "list" && (
              <View className="flex-1 ml-3">
                <View className="flex-row items-center justify-between">
                  <Text numberOfLines={2} bold size="lg" className="flex-1">
                    {item.title}
                  </Text>
                  <BookReviewIcon bookReview={item.review} />
                </View>

                <Text numberOfLines={1} size="sm">
                  by {item.author}
                </Text>
                {item.description && (
                  <Text className="mt-5" numberOfLines={3} italic>
                    {getBookDescription(item)}
                  </Text>
                )}
              </View>
            )}
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.key}
      />
      <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <ActionsheetItem>
            <ActionsheetItemText size="lg" bold>
              Filter To See
              <View
                style={{
                  height: 1,
                  backgroundColor: "lightgrey",
                  marginVertical: 1,
                  width: "100%",
                }}
              />
            </ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem
            onPress={() => {
              updateUser({ bookListFilter: undefined });
              handleClose();
            }}
          >
            <ActionsheetItemText size="lg">
              All {`(${allBooks.length})`}
            </ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem
            onPress={() => {
              updateUser({ bookListFilter: BookReview.LOVED });
              handleClose();
            }}
          >
            <BookReviewIcon bookReview={BookReview.LOVED} />
            <ActionsheetItemText size="lg">
              Loved {`(${allBooks.filter((b) => b.review === "loved").length})`}
            </ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem
            onPress={() => {
              updateUser({ bookListFilter: BookReview.LIKED });
              handleClose();
            }}
          >
            <BookReviewIcon bookReview={BookReview.LIKED} />
            <ActionsheetItemText size="lg">
              Liked {`(${allBooks.filter((b) => b.review === "liked").length})`}
            </ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem
            onPress={() => {
              updateUser({ bookListFilter: BookReview.DISLIKED });
              handleClose();
            }}
          >
            <BookReviewIcon bookReview={BookReview.DISLIKED} />
            <ActionsheetItemText size="lg">
              Disliked{" "}
              {`(${allBooks.filter((b) => b.review === "disliked").length})`}
            </ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
    </View>
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
    width: 110,
    height: 150,
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
  list: {
    padding: 10,
    marginBottom: 10,
  },
});
