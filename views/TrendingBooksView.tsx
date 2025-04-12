import { getTrendingBooks } from "@/api";
import { Heading } from "@/components/ui/heading";
import { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Image } from "expo-image";
import { Text } from "@/components/ui/text";
import { Skeleton } from "@/components/ui/skeleton";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface TrendingBook {
  title: string;
  workId: string;
  cover_url: string;
}

interface Props {}

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
  const { title, workId, cover_url } = props;

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
        {title}
      </Text>
    </View>
  );
};

export default function TrendingBooksView() {
  const [isLoading, setIsLoading] = useState(true);
  const [todayBooks, setTodayBooks] = useState<TrendingBook[]>([]);
  const [yearlyBooks, setYearlyBooks] = useState<TrendingBook[]>([]);
  const [allTimeBooks, setAllTimeBooks] = useState<TrendingBook[]>([]);

  const CACHE_KEY = "trendingBooksCache";
  const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 1 day in milliseconds

  const fetchBooks = async () => {
    try {
      const cachedData = await AsyncStorage.getItem(CACHE_KEY);
      const now = Date.now();

      if (cachedData) {
        const parsedCache = JSON.parse(cachedData);
        if (now - parsedCache.timestamp < CACHE_EXPIRATION) {
          setTodayBooks(parsedCache.todayBooks);
          setYearlyBooks(parsedCache.yearlyBooks);
          setAllTimeBooks(parsedCache.allTimeBooks);
          setIsLoading(false);
          return;
        }
      }

      setIsLoading(true);

      const [todayBooks, yearlyBooks, allTimeBooks] = await Promise.all([
        getTrendingBooks("daily"),
        getTrendingBooks("yearly"),
        getTrendingBooks("forever"),
      ]);

      const filteredTodayBooks = todayBooks.filter((i) => i.cover_url);
      const filteredYearlyBooks = yearlyBooks.filter((i) => i.cover_url);
      const filteredAllTimeBooks = allTimeBooks.filter((i) => i.cover_url);

      setTodayBooks(filteredTodayBooks);
      setYearlyBooks(filteredYearlyBooks);
      setAllTimeBooks(filteredAllTimeBooks);

      AsyncStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          timestamp: now,
          todayBooks: filteredTodayBooks,
          yearlyBooks: filteredYearlyBooks,
          allTimeBooks: filteredAllTimeBooks,
        })
      );
    } catch (error) {
      console.error("Error fetching trending books:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const renderBook = ({ item }: { item: TrendingBook }) => (
    <Book title={item.title} workId={item.workId} cover_url={item.cover_url} />
  );

  return (
    <View>
      <Heading>Trending Books Today</Heading>
      {!isLoading ? (
        <FlatList
          data={todayBooks}
          renderItem={renderBook}
          keyExtractor={(item) => item.workId}
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
      <Heading>Trending Books This Year</Heading>
      {!isLoading ? (
        <FlatList
          data={yearlyBooks}
          renderItem={renderBook}
          keyExtractor={(item) => item.workId}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
          style={{ marginBottom: 20, marginTop: 10 }}
        />
      ) : (
        <LoadingHorizontalFlatList />
      )}
      <Heading>Trending Books of All Time</Heading>
      {!isLoading ? (
        <FlatList
          data={allTimeBooks}
          renderItem={renderBook}
          keyExtractor={(item) => item.workId}
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
