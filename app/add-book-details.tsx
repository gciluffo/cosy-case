import { Card } from "@/components/ui/card";
import { OpenLibraryBook, OpenLibraryBookSearch } from "@/models/external";
import { useLocalSearchParams } from "expo-router";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";

export default function AddBookDetails() {
  const params = useLocalSearchParams();
  const book: OpenLibraryBook = JSON.parse(params.book as string);

  console.log("AddBookDetails", book);

  const renderDescription = () => {
    if (
      typeof book.description === "object" &&
      book.description?.type === "/type/text"
    ) {
      return <Text>{book.description.value}</Text>;
    } else if (typeof book.description === "string") {
      return <Text>{book.description}</Text>;
    } else {
      return <Text>No description available</Text>;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text className="text-gray-500 mb-1 ml-2">Book Details</Text>
      <Card className="radius-lg p-4">
        <View className="flex-row justify-between">
          <Text className="text-gray-500">Title</Text>
          <Text>{book.title}</Text>
        </View>
        <View className="h-[1px] bg-gray-200 my-3" />
        <View className="flex-row justify-between">
          <Text className="text-gray-500">Subtitle</Text>
          <Text>{book.subtitle}</Text>
        </View>
        <View className="h-[1px] bg-gray-200 my-3" />
        <View className="flex-row justify-between">
          <Text className="text-gray-500">Author</Text>
          <Text>{book?.author}</Text>
        </View>
        <View className="h-[1px] bg-gray-200 my-3" />
        <View className="flex-row justify-between">
          <Text className="text-gray-500">Publisher</Text>
          <Text>{book?.publishers?.length ? book?.publishers[0] : "N/A"}</Text>
        </View>
        <View className="h-[1px] bg-gray-200 my-3" />
        <View className="flex-row justify-between">
          <Text className="text-gray-500">Year Published</Text>
          <Text>{book?.publish_date}</Text>
        </View>
        <View className="h-[1px] bg-gray-200 my-3" />
        <View className="flex-row justify-between">
          <Text className="text-gray-500">ISBN-13</Text>
          <Text>{book?.isbn_13}</Text>
        </View>
        <View className="h-[1px] bg-gray-200 my-3" />
        <View className="flex-row justify-between">
          <Text className="text-gray-500">ISBN-10</Text>
          <Text>{book?.isbn_10}</Text>
        </View>
        <View className="h-[1px] bg-gray-200 my-3" />
        <View className="flex-row justify-between">
          <Text className="text-gray-500">Number Pages</Text>
          <Text>{book?.number_of_pages}</Text>
        </View>
      </Card>
      <View className="h-[20px]" />
      {book.description && (
        <>
          <Text className="text-gray-500 mb-1 ml-2">Description</Text>
          <Card className="radius-lg p-4">
            <ScrollView>{renderDescription()}</ScrollView>
          </Card>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 60,
  },
});
