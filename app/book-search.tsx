import { searchBooks } from "@/api";
import { SearchIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { TextInput, View, StyleSheet, FlatList } from "react-native";
import { Text } from "@/components/ui/text";
import BookSearchResult from "@/components/BookSearchResult";
import { OpenLibraryBook } from "@/models";

export default function BookSearch() {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<OpenLibraryBook[]>([]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      // Send API request here
      try {
        const response = await searchBooks(searchText);
        // console.log("Search results:", response);
        setSearchResults(response);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    }, 300); // Delay in milliseconds

    return () => clearTimeout(delayDebounceFn);
  }, [searchText]);

  return (
    <View>
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
            onAddToLibrary={() => {
              console.log("Add to library clicked");
            }}
          />
        )}
      />
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
    // height: 50,
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
