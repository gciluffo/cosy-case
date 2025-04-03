import { getBookDetails, getSpineImages, searchBookSpineByTitle } from "@/api";
import { OpenLibraryBookSearch, OpenLibraryBook } from "@/models";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import FontAwesome from "@expo/vector-icons/build/FontAwesome";
import ScollViewFloatingButton from "@/components/ScrollViewFloatingButton";

export default function AddBookScreen() {
  const [bookDetails, setBookDetails] = useState<
    OpenLibraryBook & OpenLibraryBookSearch
  >({} as any);
  const [spineImages, setSpineImages] = useState<string[]>([]);
  const [searchingSpineImage, setSearchingSpineImage] = useState(false);
  const [spineError, setSpineError] = useState<string | null>(null);
  const params = useLocalSearchParams();
  const { book } = params;

  // Parse the book object from the URL params
  //   const bookObject = JSON.parse(book as string);

  //   console.log({ bookObject });

  useEffect(() => {
    const bookDetailsInit = async () => {
      try {
        if (!book) {
          return;
        }

        const bookObject: OpenLibraryBookSearch = JSON.parse(book as string);
        const details = await getBookDetails(bookObject.key);
        // TODO: Get rating for book, seperate open library endpoint
        setBookDetails({ ...bookObject, ...details });
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    const bookSpinesInit = async () => {
      try {
        if (!book) {
          return;
        }
        // if no spine images do search
        setSearchingSpineImage(true);

        const bookObject: OpenLibraryBookSearch = JSON.parse(book as string);
        const images = await getSpineImages(bookObject.key);

        console.log("Spine images:", images);

        if (images.length > 0) {
          setSpineImages(images);
          setSearchingSpineImage(false);
          return;
        }

        const response = await searchBookSpineByTitle(
          bookObject.title,
          bookObject.author_name?.join(", ") || "",
          bookObject.key
        );

        console.log("Spine image response:", response);

        if (response?.signed_url) {
          setSpineImages([response.signed_url]);
        } else {
          // show error message of somekind
          // and fallback image
        }
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "Failed to find spine on google"
        ) {
          setSpineError(
            "Unable to find a spine image for this book. You can upload your own image or use the default image"
          );
        }
        console.error("Error fetching book spines:", error);
      } finally {
        setSearchingSpineImage(false);
      }
    };

    bookDetailsInit();
    bookSpinesInit();
  }, [book]);

  // Card for description
  // Star review
  // Write any notes you have
  // Show section for getting spine images or uploading your own spine image
  // Add to library button
  return (
    <ScollViewFloatingButton
      onPress={() => {}}
      buttonText="Add to Library"
      disabled={false}
    >
      <Text className="text-gray-500 mb-1 ml-1" size="lg">
        Book Details
      </Text>
      <Card>
        <View className="flex-row gap-2 p-1">
          <Image
            source={bookDetails.cover_url}
            style={styles.image}
            className="flex-1"
          />
          <View className="flex-column  h-full">
            <Text className="text-base font-semibold">{bookDetails.title}</Text>
            <Text className="text-gray-500">
              {bookDetails.author_name?.join(", ")}
            </Text>
            <Text className="text-gray-500">
              {bookDetails.first_publish_year}
            </Text>
            {bookDetails?.details?.publishers && (
              <Text className="text-gray-500">
                {bookDetails?.details.publishers[0]}
              </Text>
            )}
          </View>
          <FontAwesome
            name="chevron-right"
            size={20}
            color="gray"
            className="flex-2 ml-auto mr-2  self-center"
          />
        </View>
      </Card>
      <View className="h-6" />
      <Text className="text-gray-500 mb-1 ml-1" size="lg">
        Book Status
      </Text>
      <Card>
        <View className="flex-row justify-between">
          <Text className="text-gray-500">Status</Text>
          <Text>Read</Text>
        </View>
      </Card>
      <View className="h-6" />
      <Text className="text-gray-500 mb-1 ml-1" size="lg">
        Review
      </Text>
      <Card>
        <View className="flex-row justify-between">
          <Text className="text-gray-500">Status</Text>
          <Text>
            fowpekfpokwepfokwepof kwepfok wpeofkwpeofkwpoefkpw oekfpwoekf
          </Text>
        </View>
      </Card>
      <View className="h-6" />
      <Text className="text-gray-500 mb-1 ml-1" size="lg">
        Spine Image
      </Text>
      {spineError && (
        <Text className="text-red-500 mb-1 ml-1" size="sm">
          {spineError}
        </Text>
      )}
      <Card>
        <View className="flex-row gap-3">
          {searchingSpineImage && (
            <View style={styles.addContainer}>
              <ActivityIndicator
                size="small"
                color="gray"
                //   style={{ opacity: searchingSpineImage ? 1 : 0 }}
              />
            </View>
          )}
          {spineImages?.map((image, index) => (
            <Image
              key={index}
              source={image}
              style={[styles.spineImage]}
              className="flex-1"
              // resizeMode="contain"
            />
          ))}

          <TouchableOpacity
            style={styles.addContainer}
            onPress={() => {
              router.push("./book-spine-camera-view");
            }}
          >
            <FontAwesome name="camera" size={20} color="gray" />
          </TouchableOpacity>
        </View>
      </Card>
    </ScollViewFloatingButton>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    // backgroundColor: "#fff",
  },
  addContainer: {
    width: 80,
    height: 100,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 10,
    // marginBottom: 10,
    // alignSelf: "center",
  },
  image: {
    width: 80,
    height: 100,
    // borderRadius: 8,
  },
  spineImage: {
    height: 200,
    width: 50,
    borderRadius: 8,
    marginRight: 10,
  },
});
