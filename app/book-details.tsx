import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Text } from "@/components/ui/text";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import useStore from "@/store";
import { router, useLocalSearchParams } from "expo-router";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Image } from "expo-image";
import { useEffect, useMemo, useState } from "react";
import { getPrimaryAndSecondaryColors } from "@/utils/image";
import { scale, verticalScale } from "@/utils/scale";
import { Heading } from "@/components/ui/heading";
import { LinearGradient } from "expo-linear-gradient";
import { AddIcon, TrashIcon } from "@/components/ui/icon";
import CachedImage, { CacheManager } from "@/components/ChachedImage";
import { Book, BookReview, BookStatus } from "@/models/book";
import { getBookDetails } from "@/api";
import { OpenLibraryBook } from "@/models/open-library";
import CollapsibleDescription from "@/components/CollapsibleDescription";
import { Card } from "@/components/ui/card";
import InlinePicker from "@/components/InlinePicker";
import FontAwesome from "@expo/vector-icons/build/FontAwesome";

export default function BookDetails() {
  const [selectedSpine, setSelectedSpine] = useState<string | null>(null);
  const [localBook, setLocalBook] = useState<Book | null>(null);
  const [remoteBook, setRemoteBook] = useState<OpenLibraryBook | null>(null);
  const [loading, setLoading] = useState(false);
  const [reviewText, setReviewText] = useState<string>("");
  const [coverColors, setColorCovers] = useState<{
    primary: string;
    secondary: string;
  } | null>(null);
  const { removeBook, getBookByKey, updateBook, cases } = useStore();
  const params = useLocalSearchParams();
  const { localBookKey, bookKey, cover_url } = params;

  useEffect(() => {
    const init = async () => {
      try {
        if (localBookKey) {
          const book = getBookByKey(localBookKey as string);
          if (book) {
            setLocalBook(book);
            const selectedSpine = book.spines.find((item) => item.selected);
            if (selectedSpine) {
              setSelectedSpine(selectedSpine.cacheKey);
            }
            if (book.reviewText) {
              setReviewText(book.reviewText);
            }
          }
        }

        // if bookKey is not null, get the book from api
        if (bookKey) {
          setLoading(true);
          const book = await getBookDetails(bookKey as string);
          setRemoteBook(book);
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
      } finally {
        setLoading(false);
      }
      // if localBookKey is not null, get the book from the store
    };

    init();
  }, [localBookKey, bookKey]);

  useEffect(() => {
    const bookSpinePrimaryColorInit = async () => {
      if (coverColors) {
        return;
      }

      if (localBook?.colors) {
        setColorCovers(localBook?.colors);
      }

      if (cover_url) {
        const colors = await getPrimaryAndSecondaryColors(cover_url as string);
        setColorCovers(colors);
      }

      if (localBook?.cover_url) {
        const colors = await getPrimaryAndSecondaryColors(localBook.cover_url);
        setColorCovers(colors);
      }

      if (remoteBook?.cover_url) {
        const colors = await getPrimaryAndSecondaryColors(remoteBook.cover_url);
        setColorCovers(colors);
      }
    };

    bookSpinePrimaryColorInit();
  }, [localBook, remoteBook]);

  const removeFromLibrary = () => {
    // remove all assets on file
    const cacheKeys = localBook?.spines.map((item) => item.cacheKey);
    if (cacheKeys?.length) {
      cacheKeys.forEach((key) => {
        CacheManager.removeFromCache({ key });
      });
    }
    removeBook(localBookKey as string);
  };

  const addToLibrary = () => {
    const book = localBook || remoteBook;
    const coverUrl = localBook?.cover_url || cover_url;

    if (!book) {
      return;
    }

    router.push({
      pathname: "/add-book",
      params: {
        book: JSON.stringify({
          key: book.key,
          edition: book.edition_key,
          title: book.title,
          author: book.author,
          cover_url: coverUrl,
        }),
      },
    });
  };

  const isInLibrary = useMemo(() => {
    const book = getBookByKey((localBookKey as string) || (bookKey as string));
    return !!book;
  }, [bookKey, localBookKey, cases]);

  useEffect(() => {
    if (isInLibrary && !localBook) {
      const book = getBookByKey(
        (localBookKey as string) || (bookKey as string)
      );
      if (book) {
        setLocalBook(book);
        const selectedSpine = book.spines.find((item) => item.selected);
        if (selectedSpine) {
          setSelectedSpine(selectedSpine.cacheKey);
        }
      }
    }
  }, [isInLibrary]);

  const getDescription = (book: Book | OpenLibraryBook) => {
    if (
      typeof book.description === "object" &&
      book.description?.type === "/type/text"
    ) {
      return book.description.value;
    } else if (typeof book.description === "string") {
      return book.description;
    } else {
      return "No description available";
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ParallaxScrollView
      parallaxHeaderHeight={300}
      parallaxHeaderContent={() => (
        <>
          <LinearGradient
            colors={
              coverColors ? [coverColors?.primary, "black"] : ["white", "black"]
            }
            style={{
              height: verticalScale(450),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              style={styles.image}
              source={
                cover_url || localBook?.cover_url || remoteBook?.cover_url
              }
              contentFit="contain"
              transition={500}
            />
            <View className="justify-center items-center mt-2">
              <Heading
                size="xl"
                className="color-typography-white"
                style={{
                  textAlign: "center",
                }}
              >
                {localBook?.title || remoteBook?.title}
              </Heading>
              <Text className="color-typography-white">
                {localBook?.author || remoteBook?.author}
              </Text>
            </View>
            {isInLibrary ? (
              <>
                <View className="h-10" />
                <Button
                  onPress={removeFromLibrary}
                  size="xl"
                  style={{
                    backgroundColor: "white",
                    borderRadius: 10,
                    padding: 10,
                    zIndex: 1,
                  }}
                >
                  <ButtonIcon as={TrashIcon} color="black" />
                  <ButtonText>
                    <Text>Remove from library</Text>
                  </ButtonText>
                </Button>
              </>
            ) : (
              <>
                <View className="h-10" />
                <Button
                  onPress={addToLibrary}
                  size="xl"
                  style={{
                    backgroundColor: "white",
                    borderRadius: 10,
                    padding: 10,
                    zIndex: 1,
                  }}
                >
                  <ButtonIcon as={AddIcon} color="black" />
                  <ButtonText>
                    <Text>Add to library</Text>
                  </ButtonText>
                </Button>
              </>
            )}
          </LinearGradient>
        </>
      )}
    >
      <View style={styles.content}>
        <Heading>Description</Heading>
        <View className="h-5" />
        <View>
          {localBook && (
            <CollapsibleDescription description={getDescription(localBook)} />
          )}
          {remoteBook && (
            <CollapsibleDescription description={getDescription(remoteBook)} />
          )}
        </View>
        <View className="h-10" />
        <Heading>About</Heading>
        <View className="h-10" />
        <View className="flex-row justify-between">
          <Text className="text-gray-500">Title</Text>
          <Text>{localBook?.title || remoteBook?.title}</Text>
        </View>
        <View className="h-[1px] bg-gray-200 my-3" />
        <View className="flex-row justify-between">
          <Text className="text-gray-500">Subtitle</Text>
          <Text>{localBook?.subtitle || remoteBook?.subtitle}</Text>
        </View>
        <View className="h-[1px] bg-gray-200 my-3" />
        <View className="flex-row justify-between">
          <Text className="text-gray-500">Author</Text>
          <Text>{localBook?.author || remoteBook?.author}</Text>
        </View>
        <View className="h-[1px] bg-gray-200 my-3" />
        <View className="flex-row justify-between">
          <Text className="text-gray-500">Publisher</Text>
          <Text>
            {localBook?.publishers?.length ? localBook?.publishers[0] : "N/A"}
          </Text>
        </View>
        <View className="h-[1px] bg-gray-200 my-3" />
        <View className="flex-row justify-between">
          <Text className="text-gray-500">Year Published</Text>
          <Text>{localBook?.publish_date || remoteBook?.publish_date}</Text>
        </View>
        <View className="h-[1px] bg-gray-200 my-3" />
        <View className="flex-row justify-between">
          <Text className="text-gray-500">ISBN-13</Text>
          <Text>{localBook?.isbn_13 || remoteBook?.isbn_13}</Text>
        </View>
        <View className="h-[1px] bg-gray-200 my-3" />
        <View className="flex-row justify-between">
          <Text className="text-gray-500">ISBN-10</Text>
          <Text>{localBook?.isbn_10 || remoteBook?.isbn_13}</Text>
        </View>
        <View className="h-[1px] bg-gray-200 my-3" />
        <View className="flex-row justify-between">
          <Text className="text-gray-500">Number Pages</Text>
          <Text>
            {localBook?.number_of_pages || remoteBook?.number_of_pages}
          </Text>
        </View>
        <View className="h-[20px]" />
      </View>

      <View className="h-6 bg-gray-100" />
      {isInLibrary && localBook && (
        <>
          <View className="px-4 bg-gray-100">
            <Text className="text-gray-500 mb-1 ml-1" size="lg">
              Reading Status
            </Text>
            <Card>
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-500">Status</Text>
                <InlinePicker
                  dropdownPosition="top"
                  selectedValue={localBook.status}
                  onValueChange={(value: BookStatus) => {
                    if (localBook) {
                      localBook.status = value;
                      setLocalBook({ ...localBook });
                      updateBook(localBook.key, {
                        ...localBook,
                        status: value,
                      });
                    }
                  }}
                  items={[
                    { label: "Finished", value: "finished", icon: "check" },
                    { label: "Reading", value: "reading", icon: "book" },
                    { label: "TBR", value: "tbr", icon: "heart" },
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
                  selectedValue={localBook.review}
                  dropdownPosition="top"
                  onValueChange={(value: BookReview) => {
                    if (localBook) {
                      localBook.review = value;
                      setLocalBook({ ...localBook });
                      updateBook(localBook.key, {
                        ...localBook,
                        review: value,
                      });
                    }
                  }}
                  items={[
                    { label: "Good", value: "good", icon: "star" },
                    { label: "Okay", value: "okay", icon: "star-half" },
                    { label: "Bad", value: "bad", icon: "star-o" },
                  ]}
                  label="Status"
                />
              </View>
            </Card>
            <View className="h-6" />
            <Text className="text-gray-500 mb-1 ml-1" size="lg">
              Additional Notes
            </Text>
            <Card>
              <Textarea size="md" className="w-100">
                <TextareaInput
                  placeholder="Write your review here..."
                  blurOnSubmit={true}
                  value={reviewText}
                  onChangeText={(text) => setReviewText(text)}
                  enterKeyHint="done"
                  onSubmitEditing={() => {
                    if (localBook) {
                      localBook.reviewText = reviewText;
                      setLocalBook({ ...localBook });
                      setReviewText(reviewText);
                    }
                  }}
                />
              </Textarea>
            </Card>
            <View className="h-6" />
            <Text className="text-gray-500 mb-1 ml-1" size="lg">
              Spine Image
            </Text>
            <Card>
              <View className="flex-row">
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-3">
                    {localBook.spines?.map((image, index) => (
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedSpine(image.cacheKey);
                          const updatedSpines = localBook.spines.map(
                            (item) => ({
                              ...item,
                              selected: item.cacheKey === image.cacheKey,
                            })
                          );
                          updateBook(localBook.key, {
                            ...localBook,
                            spines: updatedSpines,
                          });
                        }}
                      >
                        <CachedImage
                          source={{
                            uri: "",
                          }}
                          cacheKey={image.cacheKey}
                          style={[
                            styles.spineImage,
                            selectedSpine === image.cacheKey &&
                              styles.itemSelected,
                          ]}
                          contentFit="contain"
                        />
                      </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                      style={styles.addContainer}
                      onPress={() => {
                        router.push({
                          pathname: "/book-spine-camera-view",
                          params: {
                            book: JSON.stringify({
                              key: localBook?.key,
                              title: localBook?.title,
                              author: localBook?.author,
                            }),
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
          </View>
          <View className="h-20" />
        </>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: scale(150),
    height: scale(200),
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  content: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -60,
    backgroundColor: "white",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
  addContainer: {
    width: 80,
    height: 100,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
});
