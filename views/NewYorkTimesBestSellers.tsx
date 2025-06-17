import { getNewYorkTimesBestSellers, getTrendingBooks } from "@/api";
import { Heading } from "@/components/ui/heading";
import { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Text } from "@/components/ui/text";
import { Skeleton } from "@/components/ui/skeleton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

interface TrendingBook {
  title: string;
  bookId: string;
  cover_url: string;
}

const LoadingHorizontalFlatList = () => {
  return (
    <FlatList
      data={[1, 2, 3, 4, 5]}
      style={{ marginBottom: 20, marginTop: 10 }}
      renderItem={(i) => (
        <View
          key={i.index}
          style={{
            width: 130,
            height: 170,
            marginHorizontal: 5,
          }}
        >
          <Skeleton className="rounded-lg" speed={4} />
        </View>
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
    />
  );
};

const Book = (props: TrendingBook) => {
  const [noImage, setNoImage] = useState(false);
  const { title, bookId, cover_url } = props;

  return (
    <View className="flex flex-col">
      {noImage ? (
        <View
          style={[styles.bookCover, { backgroundColor: "lightgrey" }]}
        ></View>
      ) : (
        <Image
          source={{ uri: cover_url }}
          style={styles.bookCover}
          contentFit="contain"
          onLoad={(event) => {
            const { width, height } = event.source;
            if (width === 1 && height === 1) {
              setNoImage(true);
            }
          }}
          cachePolicy={"memory-disk"}
        />
      )}

      <Text
        size="sm"
        style={{
          maxWidth: 120,
          marginTop: 5,
          marginLeft: 10,
          textAlign: "left",
        }}
      >
        {title.slice(0, 30)}
        {title.length > 30 ? "..." : ""}
      </Text>
    </View>
  );
};

export default function NYTTrendingBooksView() {
  const [isLoading, setIsLoading] = useState(true);
  const [fictionBooks, setFictionBooks] = useState<TrendingBook[]>([]);
  const [nonFictionBooks, setNonFictionBooks] = useState<TrendingBook[]>([]);

  const CACHE_KEY = "nytTrendingBooksCache";
  const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 1 day in milliseconds

  const fetchBooks = async () => {
    // make call to nytimes api to get books
    try {
      const cachedData = await AsyncStorage.getItem(CACHE_KEY);
      const currentTime = new Date().getTime();

      if (cachedData) {
        const { timestamp, data } = JSON.parse(cachedData);
        if (currentTime - timestamp < CACHE_EXPIRATION) {
          setFictionBooks(data.fictionBooks);
          setNonFictionBooks(data.nonFictionBooks);
          setIsLoading(false);
          return;
        }
      }

      const { fictionBooks, nonFictionBooks } =
        await getNewYorkTimesBestSellers();

      setFictionBooks(fictionBooks);
      setNonFictionBooks(nonFictionBooks);

      // Cache the data
      await AsyncStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          timestamp: currentTime,
          data: {
            fictionBooks: fictionBooks,
            nonFictionBooks: nonFictionBooks,
          },
        })
      );

      setIsLoading(false);
    } catch (error) {}
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const renderBook = ({ item }: { item: TrendingBook }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          router.push({
            pathname: "/book-details",
            params: {
              cover_url: item.cover_url,
              bookKey: item.bookId,
            },
          });
        }}
      >
        <Book
          title={item.title}
          bookId={item.bookId}
          cover_url={item.cover_url}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <Heading>NYT Best Sellers Fiction This Week</Heading>
      {!isLoading ? (
        <FlatList
          data={fictionBooks}
          renderItem={renderBook}
          keyExtractor={(item) => item.bookId}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
          style={{ marginBottom: 20, marginTop: 10 }}
          initialNumToRender={5} // Render only a few items initially
          maxToRenderPerBatch={5} // Limit the number of items rendered per batch
          windowSize={5} // Adjust the window size for rendering
          removeClippedSubviews={true} // Improve performance by removing off-screen items
        />
      ) : (
        <LoadingHorizontalFlatList />
      )}
      <Heading>NYT Best Sellers Non-Fiction This Week</Heading>
      {!isLoading ? (
        <FlatList
          data={nonFictionBooks}
          renderItem={renderBook}
          keyExtractor={(item) => item.bookId}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
          style={{ marginBottom: 20, marginTop: 10 }}
        />
      ) : (
        <LoadingHorizontalFlatList />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bookCover: {
    width: 130,
    height: 170,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
