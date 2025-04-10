import {
  getBookDetails,
  getBookSpineBucketPathFromSignedUrl,
  getSpineImages,
  getWidthHeightFromUrl,
  searchBookSpineByTitle,
} from "@/api";
import * as FileSystem from "expo-file-system";
import { OpenLibraryBookSearch, OpenLibraryBook } from "@/models/external";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import FontAwesome from "@expo/vector-icons/build/FontAwesome";
import ScollViewFloatingButton from "@/components/ScrollViewFloatingButton";
import SkiaBookSpine from "@/components/SkiaBookSpine";
import useStore from "@/store";
import { Book, BookReview, BookStatus, Spine } from "@/models/book";
import { getPrimaryAndSecondaryColors } from "@/utils/image";
import { useCanvasRef, makeImageFromView } from "@shopify/react-native-skia";
import { CacheManager } from "@/components/ChachedImage";
import InlinePicker from "@/components/InlinePicker";

export default function AddBookScreen() {
  const [bookDetails, setBookDetails] = useState<
    OpenLibraryBook & OpenLibraryBookSearch & { primaryColor?: string }
  >({} as any);
  const [spineImages, setSpineImages] = useState<string[]>([]);
  const [searchingSpineImage, setSearchingSpineImage] = useState(false);
  const [spineError, setSpineError] = useState<string | null>(null);
  const [coverColors, setCoverColors] = useState<{
    primary: string;
    secondary: string;
  } | null>(null);
  const [addingBook, setAddingBook] = useState(false);
  const [selectedSpine, setSelectedSpine] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState(BookStatus.READ);
  const [selectedReview, setSelectedReview] = useState(BookReview.GOOD);
  const canvasRef = useCanvasRef();
  const params = useLocalSearchParams();
  const { book } = params;
  const { addBook } = useStore();

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

        // console.log("Spine images:", images);

        if (images.length > 0) {
          setSpineImages(images);
          setSearchingSpineImage(false);
          setSelectedSpine(images[0]);
          return;
        }

        const response = await searchBookSpineByTitle(
          bookObject.title,
          bookObject.author_name?.join(", ") || "",
          bookObject.key
        );

        // console.log("Spine image response:", response);

        if (response?.signed_url) {
          setSpineImages([response.signed_url]);
          setSelectedSpine(response.signed_url);
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
            "Unable to find a spine image for this book. You can upload your own image or use the placeholder image."
          );
        }
        console.error("Error fetching book spines:", error);
      } finally {
        setSearchingSpineImage(false);
      }
    };

    const bookSpinePrimaryColorInit = async () => {
      const bookObject: OpenLibraryBookSearch = JSON.parse(book as string);
      if (!bookObject.cover_url) {
        return;
      }

      try {
        const colors = await getPrimaryAndSecondaryColors(bookObject.cover_url);
        // console.log("Primary color:", primary);
        setCoverColors(colors);
      } catch (error) {}
    };

    bookDetailsInit();
    bookSpinesInit();
    bookSpinePrimaryColorInit();
  }, [book]);

  const onAddToLibrary = () => {
    const spines: Spine[] = [];
    setAddingBook(true);

    setTimeout(async () => {
      // you can pass an optional rectangle
      // to only save part of the image
      const image = canvasRef.current?.makeImageSnapshot();
      console.log("Canvas image:", image);
      if (image) {
        const cacheKey = `${bookDetails.key}-spine-placeholder`;
        await CacheManager.saveBytesToCache({
          image,
          key: cacheKey,
        });

        spines.push({
          cacheKey: cacheKey,
          selected: spineImages.length === 0,
          originalImageHeight: 200,
          originalImageWidth: 60,
        });
      }

      if (spineImages.length > 0) {
        const signedUrl = await getBookSpineBucketPathFromSignedUrl(
          selectedSpine!,
          bookDetails.key
        );
        const cacheKey = `${bookDetails.key}-spine-${new Date().getTime()}`;
        await CacheManager.downloadAsync({
          uri: signedUrl,
          key: cacheKey,
          options: {},
        });
        const { width, height } = getWidthHeightFromUrl(signedUrl);
        spines.push({
          cacheKey: cacheKey,
          selected: true,
          originalImageHeight: height,
          originalImageWidth: width,
        });
      }

      const bookToAdd: Book = {
        ...bookDetails,
        status: selectedStatus,
        review: selectedReview,
        colors: {
          primary: coverColors?.primary || "#000000",
          secondary: coverColors?.secondary || "#FFFFFF",
        },
        spines,
      };

      console.log("Book to add:", bookToAdd);
      addBook(bookToAdd);
      router.back();
      setAddingBook(false);
    }, 1000);
  };

  // console.log("imageUrl", spineImages[0]);

  // Card for description
  // Star review
  // Write any notes you have
  // Show section for getting spine images or uploading your own spine image
  // Add to library button
  return (
    <ScollViewFloatingButton
      onPress={() => onAddToLibrary()}
      buttonText="Add to Library"
      loading={addingBook}
    >
      <Text className="text-gray-500 mb-1 ml-1" size="lg">
        Book Details
      </Text>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/add-book-details",
            params: {
              book: JSON.stringify(bookDetails),
            },
          })
        }
      >
        <Card>
          <View className="flex-row gap-2 p-1">
            <Image
              source={bookDetails.cover_url}
              style={styles.image}
              className="flex-1"
            />
            <View className="flex-column flex-1">
              <Text className="text-base font-semibold">
                {bookDetails.title}
              </Text>
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
              className="flex-2 ml-auto mr-2 self-center"
            />
          </View>
        </Card>
      </TouchableOpacity>

      <View className="h-6" />
      <Text className="text-gray-500 mb-1 ml-1" size="lg">
        Reading Status
      </Text>
      <Card>
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-500">Status</Text>
          <InlinePicker
            selectedValue={selectedStatus}
            onValueChange={setSelectedStatus}
            items={[
              { label: "Read", value: "read" },
              { label: "Reading", value: "reading" },
              { label: "Wishlist", value: "wishlist" },
            ]}
            label="Status"
          />
        </View>
      </Card>
      <View className="h-6" />
      <Text className="text-gray-500 mb-1 ml-1" size="lg">
        Book Review
      </Text>
      <Card>
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-500">Review</Text>
          <InlinePicker
            selectedValue={selectedReview}
            onValueChange={setSelectedReview}
            items={[
              { label: "Good", value: "good" },
              { label: "Okay", value: "okay" },
              { label: "Bad", value: "bad" },
            ]}
            label="Status"
          />
        </View>
      </Card>
      <View className="h-6" />
      <Text className="text-gray-500 mb-1 ml-1" size="lg">
        Spine Image
      </Text>
      {spineError && (
        <Text className="text-orange-500 mb-1 ml-1" size="sm">
          {spineError}
        </Text>
      )}
      <Card>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-3">
                {searchingSpineImage && (
                  <View style={styles.addContainer}>
                    <ActivityIndicator size="small" color="gray" />
                  </View>
                )}
                {spineImages?.map((image, index) => (
                  <TouchableOpacity onPress={() => setSelectedSpine(image)}>
                    <Image
                      key={index}
                      source={image}
                      style={[
                        styles.spineImage,
                        selectedSpine === image && styles.selectedSpineImage,
                      ]}
                      className="flex-1"
                      contentFit="cover"
                    />
                  </TouchableOpacity>
                ))}
                {spineError &&
                  bookDetails.author_name &&
                  coverColors &&
                  !spineImages?.length && (
                    <SkiaBookSpine
                      colors={coverColors}
                      title={bookDetails.title}
                      author={bookDetails.author_name?.join(", ") || ""}
                      canvasRef={canvasRef}
                    />
                  )}
                <TouchableOpacity
                  style={styles.addContainer}
                  onPress={() => {
                    router.push("./book-spine-camera-view");
                  }}
                >
                  <FontAwesome name="camera" size={20} color="gray" />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
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
    height: 250,
    width: 50,
    borderRadius: 5,
    marginRight: 5,
  },
  selectedSpineImage: {
    borderWidth: 3,
    // blue border color
    borderColor: "#007AFF",
  },
});
