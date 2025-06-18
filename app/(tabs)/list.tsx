import useStore from "@/store";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { isTablet, moderateScale, scale } from "@/utils/scale";
import { router } from "expo-router";
import { useMemo } from "react";
import { Book } from "@/models/book";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";

export default function TabTwoScreen() {
  const { cases } = useStore();

  const allBooks = useMemo(() => {
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
    return uniqueBooks;
  }, [cases]);

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
    <FlatList
      contentContainerStyle={{
        paddingBottom: 100,
      }}
      style={styles.list}
      data={allBooks}
      numColumns={3}
      ItemSeparatorComponent={() => <View style={{ marginVertical: 10 }} />}
      renderItem={({ item }) => (
        // <CachedImage />
        <TouchableOpacity
          className="rounded-lg p-2"
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
            <Image
              source={{ uri: item.cover_url }}
              className="rounded-lg"
              style={styles.image}
              contentFit="contain"
            />
          ) : (
            <View style={{ ...styles.image, backgroundColor: "grey" }} />
          )}
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item.key}
    />
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
