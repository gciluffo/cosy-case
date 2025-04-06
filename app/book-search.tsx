import { searchBooks } from "@/api";
import { SearchIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { TextInput, View, StyleSheet, FlatList } from "react-native";
import { Text } from "@/components/ui/text";
import BookSearchResult from "@/components/BookSearchResult";
import { OpenLibraryBookSearch } from "@/models";
import { Skeleton } from "@/components/ui/skeleton";
import { router } from "expo-router";

export default function BookSearch() {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<OpenLibraryBookSearch[]>(
    []
  );
  const [loading, setLoading] = useState(false);

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
        // console.log("Search results:", response);
        setSearchResults(response);
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

  const onAddToLibrary = (book: OpenLibraryBookSearch) => {
    router.push({
      pathname: "/add-book",
      params: {
        book: JSON.stringify(book),
      },
    });
  };

  return (
    <View>
      {/* // Animate a cancel button and move it to the header */}
      <Input style={styles.searchInput}>
        <InputSlot className="pl-3">
          <InputIcon as={SearchIcon} />
        </InputSlot>
        <InputField
          placeholder="Search..."
          onChange={(e) => {
            setSearchText(e.nativeEvent.text);
          }}
        />
      </Input>

      {loading && (
        <FlatList
          style={{ padding: 10 }}
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
                  backgroundColor: "#e0e0e0",
                  borderRadius: 5,
                  marginRight: 10,
                }}
              />
              <View style={{ flex: 1 }}>
                <Skeleton
                  speed={4}
                  style={{
                    height: 15,
                    backgroundColor: "#e0e0e0",
                    borderRadius: 5,
                    marginBottom: 5,
                    width: "70%",
                  }}
                />
                <Skeleton
                  speed={4}
                  style={{
                    height: 15,
                    backgroundColor: "#e0e0e0",
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
                  backgroundColor: "#e0e0e0",
                  borderRadius: 5,
                  marginLeft: 10,
                }}
              />
            </View>
          )}
        />
      )}

      {searchResults.length > 0 && (
        <FlatList
          style={{ padding: 10 }}
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
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    // make it look like an apple search bar you might find in the app store
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
    padding: 10,
    margin: 10,
    height: 40,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
