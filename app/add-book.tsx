import {
  getBookDetails,
  getBookDetailsV2,
  getBookSpineBucketPathFromSignedUrl,
  getSpineImages,
  searchBookSpineByTitle,
  searchBooksV2,
} from "@/api";
import { OpenLibraryBook } from "@/models/open-library";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import FontAwesome from "@expo/vector-icons/build/FontAwesome";
import ScollViewFloatingButton from "@/components/ScrollViewFloatingButton";
import useStore from "@/store";
import {
  Book,
  BookReview,
  BookStatus,
  GenericBookGenre,
  Spine,
} from "@/models/book";
import {
  getPrimaryAndSecondaryColors,
  getWidthHeightFromUrl,
} from "@/utils/image";
import { CacheManager } from "@/components/ChachedImage";
import InlinePicker from "@/components/InlinePicker";
import CompactBookShelf from "@/components/CompactBookShelf";
import { scale, verticalScale } from "@/utils/scale";
import PlaceholderBookSpine from "@/components/PlaceholderBookSpine";
import { captureRef } from "react-native-view-shot";
import { sortBookcase } from "@/utils/bookcase";
import {
  getBookGenericGenresFromSubjects,
  getGenericGenreFromCategories,
  isStringValidIsbn,
} from "@/utils/books";
import { calculateBadgeProgress } from "@/utils/badges";

export interface AddBookParam {
  key: string;
  edition: string;
  title: string;
  author: string;
  cover_url: string;
}

export default function AddBookScreen() {
  const {
    addBooksToCase,
    cases,
    getCaseByName,
    updateCase,
    badges,
    setBadges,
    updateBook,
  } = useStore();
  const [bookDetails, setBookDetails] = useState<OpenLibraryBook>(
    {} as OpenLibraryBook
  );
  const [spineImages, setSpineImages] = useState<string[]>([]);
  const [searchingSpineImage, setSearchingSpineImage] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [spineError, setSpineError] = useState<string | null>(null);
  const [coverColors, setCoverColors] = useState<{
    primary: string;
    secondary: string;
  } | null>(null);
  const [addingBook, setAddingBook] = useState(false);
  const [selectedSpine, setSelectedSpine] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState(BookStatus.READING);
  const [selectedReview, setSelectedReview] = useState(BookReview.LIKED);
  const [reviewText, setReviewText] = useState<string>("");
  const [selectedShelves, setSelectedShelves] = useState<string[]>([
    cases.find((c) => c.isDefault)?.name || "default",
  ]);
  const spineRef = useRef(null);
  const params = useLocalSearchParams();
  const { book, refetchSpineImages } = params;
  const bookObject: AddBookParam = JSON.parse(book as string);

  useEffect(() => {
    const bookSpinesInit = async () => {
      try {
        const images = await getSpineImages(bookObject.key);

        if (images.length > 0) {
          setSpineImages(images);
          setSelectedSpine(images[0]);
          return;
        }
      } catch (error) {
      } finally {
      }
    };

    if (refetchSpineImages) {
      bookSpinesInit();
    }
  }, [refetchSpineImages]);

  useEffect(() => {
    const bookDetailsInit = async () => {
      try {
        if (!book) {
          return;
        }

        setLoadingDetails(true);
        const details = await getBookDetails(
          bookObject.key,
          bookObject.edition
        );
        // console.log("Book details:", details);
        // TODO: Get rating for book, seperate open library endpoint
        setBookDetails({ ...bookObject, ...details });
      } catch (error) {
        console.error("Error fetching book details:", error);
      } finally {
        setLoadingDetails(false);
      }
    };

    const bookSpinesInit = async () => {
      try {
        if (!book) {
          return;
        }
        // if no spine images do search
        setSearchingSpineImage(true);

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
          bookObject.author,
          bookObject.key
        );

        // console.log("Spine image response:", response);

        if (response?.signed_url) {
          setSpineImages([response.signed_url]);
          setSelectedSpine(response.signed_url);
        } else {
          setSelectedSpine("placeholder");
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

  const onAddToLibrary = async () => {
    const spines: Spine[] = [];
    setAddingBook(true);

    try {
      const uri = await captureRef(spineRef, {
        width: 50,
        height: 250,
        quality: 1,
      });
      if (uri) {
        const cacheKey = `${bookDetails.key}-spine-placeholder`;
        await CacheManager.downloadAsync({
          uri: uri,
          key: cacheKey,
          options: {},
        });

        spines.push({
          cacheKey: cacheKey,
          selected: spineImages.length === 0 || selectedSpine === "placeholder",
          originalImageHeight: 250,
          originalImageWidth: 50,
        });
      }

      if (spineImages.length > 0 && selectedSpine !== "placeholder") {
        const signedUrl = await getBookSpineBucketPathFromSignedUrl(
          selectedSpine!,
          bookDetails.key
        );
        const { primary, secondary } = await getPrimaryAndSecondaryColors(
          signedUrl
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
          colors: {
            primary: primary,
            secondary: secondary,
          },
        });
      }

      // Get some more information about the genre of the book
      const isbn = bookDetails?.isbn_13?.[0] || bookDetails?.isbn_10?.[0];
      let categories: string[] | undefined = undefined;
      try {
        console.log("Searching for book categories with ISBN:", isbn);
        const response = await searchBooksV2(
          isStringValidIsbn(isbn) ? `isbn:${isbn}` : bookDetails.title
        );

        if (response.totalItems === 0) {
          throw new Error("No book found with the provided ISBN or title.");
        }

        const id = response.items?.[0]?.id;
        const detailsV2 = await getBookDetailsV2(id);
        categories = detailsV2?.volumeInfo?.categories;
      } catch (error) {
        console.warn("Error fetching book categories:", error);
      }

      const genericGenre = categories
        ? getGenericGenreFromCategories(categories)
        : getBookGenericGenresFromSubjects(bookDetails?.subjects || [])[0];

      const bookToAdd: Book = {
        ...bookDetails,
        cover_url: bookObject.cover_url,
        cover_urls: [bookObject.cover_url, bookDetails.cover_url],
        status: selectedStatus,
        review: selectedReview,
        reviewText: reviewText,
        colors: {
          primary: coverColors?.primary || "#000000",
          secondary: coverColors?.secondary || "#FFFFFF",
        },
        spines,
        categories: categories,
        genericGenre: genericGenre,
        dateAdded: new Date().toISOString(),
        dateFinished:
          selectedStatus === BookStatus.FINISHED
            ? new Date().toISOString()
            : undefined,
        dateStarted:
          selectedStatus === BookStatus.READING
            ? new Date().toISOString()
            : undefined,
      };

      // if status is finished, calculate impact on badge progress
      // console.log("selectedStatus:", selectedStatus);
      if (selectedStatus === BookStatus.FINISHED) {
        const newBadgeArr = calculateBadgeProgress(bookToAdd, badges);
        setBadges(newBadgeArr);
      }

      // console.log("Book to add:", bookToAdd);
      // // addBookToCase("default", bookToAdd);
      for (const shelf of selectedShelves) {
        addBooksToCase(shelf, [bookToAdd]);
        // if there is a sort on the book case, sort the books

        const bookCase = getCaseByName(shelf);

        if (bookCase?.sortOrder) {
          // sort and update the book case
          sortBookcase(bookCase, bookCase.sortOrder);
          updateCase(bookCase?.name!, { books: bookCase?.books });
        }
      }

      router.back();
      setAddingBook(false);
    } catch (error) {
      console.error("Error adding book to library:", error);
    }
  };

  return (
    <ScollViewFloatingButton
      onPress={() => onAddToLibrary()}
      buttonText="Add to Library"
      loading={addingBook}
      disabled={selectedSpine === null || !bookDetails}
    >
      <Text className="text-gray-500 mb-1 ml-1">Book Details</Text>
      <TouchableOpacity
        onPress={() => {
          router.push({
            pathname: "/add-book-details",
            params: {
              book: JSON.stringify(bookDetails),
            },
          });
        }}
      >
        <Card>
          <View className="flex-row gap-2 p-1">
            <Image
              source={bookObject.cover_url}
              style={styles.image}
              contentFit="contain"
            />
            <View className="flex-column flex-1">
              <Text className="text-base font-semibold">
                {bookObject.title || bookDetails.title}
              </Text>
              <Text className="text-gray-500">
                {bookObject.author || bookDetails.author}
              </Text>
              <Text className="text-gray-500">{bookDetails.publish_date}</Text>
              {bookDetails?.publishers && (
                <Text className="text-gray-500">
                  {bookDetails?.publishers[0]}
                </Text>
              )}
              {bookDetails?.ratings && (
                <View className="flex-row gap-1">
                  <FontAwesome
                    name="star"
                    size={14}
                    color="#FFD700"
                    className="self-center"
                  />
                  <Text className="text-gray-500">
                    {bookDetails?.ratings?.summary?.average?.toFixed(1)}
                  </Text>
                  <Text className="text-gray-500">
                    ({bookDetails?.ratings?.summary?.count} ratings)
                  </Text>
                </View>
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
      <Text className="text-gray-500 mb-1 ml-1">Reading Status</Text>
      <Card>
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-500">Status</Text>
          <InlinePicker
            selectedValue={selectedStatus}
            onValueChange={setSelectedStatus}
            dropdownPosition="bottom"
            items={[
              { label: "Finished", value: "finished", icon: "check" },
              { label: "Reading", value: "reading", icon: "book" },
              { label: "TBR", value: "tbr", icon: "heart" },
            ]}
            label="Status"
          />
        </View>
      </Card>
      {selectedStatus === BookStatus.FINISHED && (
        <>
          <View className="h-6" />
          <Text className="text-gray-500 mb-1 ml-1">Book Review</Text>
          <Card>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-500">Review</Text>
              <InlinePicker
                dropdownPosition="bottom"
                selectedValue={selectedReview}
                onValueChange={setSelectedReview}
                items={[
                  { label: "Loved", value: "loved", icon: "heart" },
                  { label: "Liked", value: "liked", icon: "smile-o" },
                  { label: "Disliked", value: "disliked", icon: "frown-o" },
                ]}
                label="Status"
              />
            </View>
          </Card>
        </>
      )}

      <View className="h-6" />
      <Text className="text-gray-500 mb-1 ml-1">Additional Notes</Text>
      <Card>
        <Textarea size="md" className="w-100">
          <TextareaInput
            placeholder="Write your review here..."
            value={reviewText}
            onChangeText={setReviewText}
          />
        </Textarea>
      </Card>
      <View className="h-6" />
      <Text className="text-gray-500 mb-1 ml-1">Spine Image</Text>
      {spineError && (
        <Text className="text-orange-500 mb-1 ml-1" size="sm">
          {spineError}
        </Text>
      )}
      <Card>
        <View className="flex-row">
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
                      selectedSpine === image && styles.itemSelected,
                    ]}
                    className="flex-1"
                    contentFit="contain" // Ensures the entire image is visible without cropping
                  />
                </TouchableOpacity>
              ))}
              {bookDetails.author && coverColors && (
                <TouchableOpacity
                  onPress={() => setSelectedSpine("placeholder")}
                  style={[
                    selectedSpine === "placeholder" && styles.itemSelected,
                  ]}
                >
                  <PlaceholderBookSpine
                    colors={coverColors}
                    title={bookDetails.title}
                    author={bookDetails.author || ""}
                    viewRef={spineRef}
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.addContainer}
                onPress={() => {
                  router.push({
                    pathname: "/book-spine-camera-view",
                    params: {
                      book,
                    },
                  });
                }}
              >
                <FontAwesome name="camera" size={20} color="gray" />
              </TouchableOpacity>
            </View>
            <View className="h-5" />
          </ScrollView>
        </View>
      </Card>
      <View className="h-6" />
      <Text className="text-gray-500 mb-1 ml-1">Case</Text>
      <Card>
        <FlatList
          horizontal={true}
          data={cases}
          renderItem={({ item, index }) => (
            <View className="flex" key={item.name}>
              <TouchableOpacity
                style={[
                  selectedShelves.includes(item.name) && styles.itemSelected,
                ]}
                onPress={() => {
                  if (item.isDefault) {
                    return;
                  }

                  if (selectedShelves.includes(item.name)) {
                    setSelectedShelves(
                      selectedShelves.filter((shelf) => shelf !== item.name)
                    );
                  } else {
                    setSelectedShelves([...selectedShelves, item.name]);
                  }
                }}
              >
                <CompactBookShelf
                  bookCase={item}
                  caseWidth={scale(120)}
                  caseHeight={verticalScale(100)}
                  shelfHeight={verticalScale(40)}
                />
              </TouchableOpacity>
              <Text>{item.name}</Text>
            </View>
          )}
          ItemSeparatorComponent={() => {
            return <View className="m-2" />;
          }}
          ListFooterComponent={() => {
            return (
              <TouchableOpacity
                className="ml-4"
                style={styles.addContainer}
                onPress={() => {
                  router.push("/add-case");
                }}
              >
                <FontAwesome name="plus" size={20} color="gray" />
              </TouchableOpacity>
            );
          }}
        />
      </Card>
    </ScollViewFloatingButton>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  addContainer: {
    width: 80,
    height: 100,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 100,
  },
  spineImage: {
    height: 250,
    width: 50,
    borderRadius: 5,
    marginRight: 5,
  },
  itemSelected: {
    borderWidth: 3,
    borderColor: "#007AFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 3,
  },
});
