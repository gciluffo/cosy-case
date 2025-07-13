import { router, useLocalSearchParams } from "expo-router";
import { FlatList, View, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Book } from "@/models/book";
import { scale } from "@/utils/scale";

export default function BookList() {
  const params = useLocalSearchParams();
  const books: Book[] =
    typeof params.books === "string"
      ? JSON.parse(params.books)
      : Array.isArray(params.books)
      ? (params.books as unknown as Book[])
      : [];

  // return a FlatList of books 2 columns wide
  return (
    <FlatList
      data={books}
      keyExtractor={(item) => item.key}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={{ position: "relative", marginBottom: 10, padding: 10 }}
          onPress={() => {
            router.push({
              pathname: "/book-details",
              params: { bookKey: item.key },
            });
          }}
        >
          <Image
            source={{ uri: item.cover_url }}
            className="rounded-lg"
            style={styles.image}
            contentFit="fill"
          />
        </TouchableOpacity>
      )}
      numColumns={3}
      contentContainerStyle={{ padding: 10, paddingBottom: 100 }}
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
