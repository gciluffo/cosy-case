import { getBookDetails, searchBooks, searchBooksV2 } from "@/api";
import { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, FlatList, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import BookSearchResult from "@/components/BookSearchResult";
import { OpenLibraryBookSearch } from "@/models/open-library";
import { Skeleton } from "@/components/ui/skeleton";
import { router } from "expo-router";
import useStore from "@/store";
import SearchInput from "@/components/SearchInput";
import TrendingBooksView from "@/views/TrendingBooksView";
import { Book } from "@/models/book";
import { convertToHttps } from "@/utils/image";
import NYTTrendingBooksView from "@/views/NewYorkTimesBestSellers";

export default function BookSearch() {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<OpenLibraryBookSearch[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const { cases } = useStore();

  const findAndUpdateMissingCovers = async (books: OpenLibraryBookSearch[]) => {
    const booksClone = [...books];
    for (const book of booksClone) {
      if (!book.cover_url) {
        const bookDetails = await getBookDetails(book.key);
        const isbn = bookDetails?.isbn_13?.[0] || bookDetails?.isbn_10?.[0];
        if (!isbn) {
          // console.warn("No ISBN found for book:", book);
          continue; // Skip this book if no ISBN is available
        }
        const response = await searchBooksV2(`isbn:${isbn}`);
        const bookUrl = response?.items?.[0]?.volumeInfo?.imageLinks?.thumbnail;
        if (bookUrl) {
          book.cover_url = convertToHttps(bookUrl);
        }
      }
    }
    setSearchResults(booksClone);
  };

  useEffect(() => {
    if (searchText?.length < 3) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      // Send API request here
      try {
        setLoading(true);
        const response = await searchBooks(searchText);
        setSearchResults(response);

        findAndUpdateMissingCovers(response);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    }, 300); // Delay in milliseconds

    return () => {
      clearTimeout(delayDebounceFn);
      setSearchResults([]);
      setLoading(false);
      // Cleanup function to clear the timeout
    };
  }, [searchText]);

  // console.log("Search results:", searchResults);

  const onAddToLibrary = (book: OpenLibraryBookSearch) => {
    router.push({
      pathname: "/add-book",
      params: {
        book: JSON.stringify({
          key: book.key,
          edition: book.editions.docs[0].key,
          title: book.title,
          author: book.author_name?.join(", ") || "",
          cover_url: book.cover_url,
        }),
      },
    });
  };

  const isBookAlreadyInLibrary = (book: OpenLibraryBookSearch) => {
    const formattedKey = book.key.split("/").pop();
    return cases.some((c) => c.books.find((b) => b.key === formattedKey));
  };

  return (
    <View className="m-4">
      <SearchInput
        value={searchText}
        setSearchText={setSearchText}
        onCancel={() => {
          setSearchText("");
          setSearchResults([]);
        }}
      />

      <View className="h-5" />

      {loading && (
        <FlatList
          contentContainerStyle={{ paddingBottom: 100 }}
          data={Array(10).fill(null)} // Display 5 skeleton rows
          keyExtractor={(_, index) => `skeleton-${index}`}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={() => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 10,
              }}
            >
              <Skeleton
                speed={4}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 5,
                  marginRight: 10,
                }}
              />
              <View style={{ flex: 1 }}>
                <Skeleton
                  speed={4}
                  style={{
                    height: 15,
                    borderRadius: 5,
                    marginBottom: 5,
                    width: "70%",
                  }}
                />
                <Skeleton
                  speed={4}
                  style={{
                    height: 15,
                    borderRadius: 5,
                    width: "50%",
                  }}
                />
              </View>
              <Skeleton
                speed={4}
                style={{
                  width: 50,
                  height: 30,
                  borderRadius: 5,
                  marginLeft: 10,
                }}
              />
            </View>
          )}
        />
      )}

      {searchResults.length && (
        <FlatList
          contentContainerStyle={{ paddingBottom: 100 }}
          data={searchResults}
          keyExtractor={(item) => item.key}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item }) => (
            <BookSearchResult
              title={item.title}
              imageUrl={item.cover_url}
              author={item.author_name?.[0]}
              onAddToLibrary={() => onAddToLibrary(item)}
              isBookAlreadyInLibrary={isBookAlreadyInLibrary(item)}
            />
          )}
        />
      )}

      {!searchText && (
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 60,
          }}
        >
          <TrendingBooksView />
          <NYTTrendingBooksView />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
