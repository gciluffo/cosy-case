import { captureRef } from "react-native-view-shot";
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
import { useEffect, useMemo, useRef, useState } from "react";
import {
  getObjectKeyFromSignedUrl,
  getPrimaryAndSecondaryColors,
  getWidthHeightFromUrl,
} from "@/utils/image";
import { moderateScale, verticalScale } from "@/utils/scale";
import { Heading } from "@/components/ui/heading";
import { LinearGradient } from "expo-linear-gradient";
import { AddIcon, TrashIcon } from "@/components/ui/icon";
import CachedImage, { CacheManager } from "@/components/ChachedImage";
import { Book, BookReview, BookStatus } from "@/models/book";
import {
  getBookDetails,
  getBookSpineBucketPathFromSignedUrl,
  getSpineImages,
  searchBooks,
} from "@/api";
import { OpenLibraryBook } from "@/models/open-library";
import CollapsibleDescription from "@/components/CollapsibleDescription";
import { Card } from "@/components/ui/card";
import InlinePicker from "@/components/InlinePicker";
import FontAwesome from "@expo/vector-icons/build/FontAwesome";
import { getBookDescription, isStringIsbn13 } from "@/utils/books";
import PlaceholderBookSpine from "@/components/PlaceholderBookSpine";
import { calculateBadgeProgressForCompleteBook } from "@/utils/badges";

export default function BookDetails() {
  const [localBook, setLocalBook] = useState<Book | null>(null);
  const [remoteBook, setRemoteBook] = useState<OpenLibraryBook | null>(null);
  const [loading, setLoading] = useState(false);
  const [reviewText, setReviewText] = useState<string>("");
  const spineRef = useRef(null);
  const [coverColors, setColorCovers] = useState<{
    primary: string;
    secondary: string;
  } | null>(null);
  const [spines, setSpines] = useState<
    { url: string; isSelected: boolean; cacheKey: string }[]
  >([]);
  const { removeBook, getBookByKey, updateBook, cases, badges, setBadges } =
    useStore();
  const params = useLocalSearchParams();
  const { localBookKey, bookKey, cover_url, refetchSpineImages } = params;

  const isInLibrary = useMemo(() => {
    const book = getBookByKey((localBookKey as string) || (bookKey as string));
    return !!book;
  }, [bookKey, localBookKey, cases]);

  // console.log({ bookspines: localBook?.spines, spines });

  useEffect(() => {
    const init = async () => {
      try {
        if (localBookKey) {
          const book = getBookByKey(localBookKey as string);
          if (book) {
            setLocalBook(book);
            const remoteSpines = await getSpineImages(book.key);
            const localBookSpines = book?.spines || [];
            const localSelectedSpine = localBookSpines.find(
              (s) => s.selected && s.cacheKey.includes(book.key)
            );
            const list = remoteSpines.map((url) => {
              return {
                url,
                isSelected:
                  (!localSelectedSpine?.cacheKey.includes("placeholder") &&
                    localSelectedSpine?.cacheKey.includes(book.key)) ||
                  false,
                cacheKey:
                  localBookSpines.find(
                    (s) =>
                      !s.cacheKey.includes("placeholder") &&
                      s.cacheKey.includes(book.key)
                  )?.cacheKey || ``,
              };
            });

            setSpines(list);
            if (book.reviewText) {
              setReviewText(book.reviewText);
            }
          }
        }

        // if bookKey is not null, get the book from api
        if (bookKey) {
          setLoading(true);

          let workKey;
          if (isStringIsbn13(bookKey as string)) {
            const searchResult = await searchBooks(bookKey as string);
            if (searchResult.length > 0) {
              workKey = searchResult[0].key;
            } else {
              console.warn("No book found for ISBN:", bookKey);
            }
          }

          const book = await getBookDetails(workKey || (bookKey as string));
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
  }, [localBookKey, bookKey, refetchSpineImages]);

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

  useEffect(() => {
    if (isInLibrary && !localBook) {
      const book = getBookByKey(
        (localBookKey as string) || (bookKey as string)
      );
      if (book) {
        setLocalBook(book);
      }
    }
  }, [isInLibrary]);

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

  // once we have the isbn update the route params so that the header can build an amazon link
  useEffect(() => {
    if (localBook?.isbn_13) {
      router.setParams({
        isbn13: localBook?.isbn_13,
      });
    }
    if (remoteBook?.isbn_13) {
      router.setParams({
        isbn13: remoteBook?.isbn_13,
      });
    }
  }, [localBook?.isbn_13, remoteBook?.isbn_13]);

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

  const isPlaceholderSpineSelected = useMemo(() => {
    const selectedSpine = localBook?.spines.find((s) => s.selected);
    return selectedSpine?.cacheKey.includes("placeholder");
  }, [localBook?.spines]);

  const onSpineSelected = async (url: string, cacheKey?: string) => {
    if (!localBook) {
      return;
    }

    if (url.includes("placeholder")) {
      // If the placeholder is selected
      // Check if the image exist locally, if not save the image
      const newCacheKey = `${localBook.key}-spine-placeholder`;
      const exists = await CacheManager.checkIfCached({ key: newCacheKey });

      const newSpine = {
        cacheKey: newCacheKey,
        selected: true,
        originalImageHeight: 250,
        originalImageWidth: 50,
      };

      if (!exists) {
        const uri = await captureRef(spineRef, {
          width: 50,
          height: 250,
          quality: 1,
        });

        await CacheManager.downloadAsync({
          uri: uri,
          key: newCacheKey,
          options: {},
        });

        // update localBook
        setLocalBook((prev: Book | null) => {
          if (!prev) return prev;

          return {
            ...prev,
            author: prev.author ?? null,
            spines: [...prev.spines, newSpine],
          };
        });

        // update book in store, make sure to deselect other spines
        updateBook(localBook.key, {
          ...localBook,
          spines: [
            ...localBook.spines.map((s) => ({ ...s, selected: false })),
            newSpine,
          ],
        });
      } else {
        // set Localbook if the spine is already cached
        setLocalBook((prev: Book | null) => {
          if (!prev) return prev;

          return {
            ...prev,
            spines: prev.spines.map((s) =>
              s.cacheKey === newCacheKey
                ? { ...s, selected: true }
                : { ...s, selected: false }
            ),
          };
        });

        // update book in store
        updateBook(localBook.key, {
          ...localBook,
          spines: localBook.spines.map((s) =>
            s.cacheKey === newCacheKey
              ? { ...s, selected: true }
              : { ...s, selected: false }
          ),
        });
      }

      // deselect everything in spines since playholder spine is selected
      setSpines((prev) =>
        prev.map((s) => ({
          ...s,
          isSelected: false,
        }))
      );

      return;
    }

    // if remote spine is selected, check if it exists in the local cache
    if (!cacheKey) {
      const signedUrl = await getBookSpineBucketPathFromSignedUrl(
        url,
        localBook.key
      );
      const cacheKey = `${localBook.key}-spine-${new Date().getTime()}`;
      await CacheManager.downloadAsync({
        uri: signedUrl,
        key: cacheKey,
        options: {},
      });

      // update book in store, make sure the other spines are not selected
      updateBook(localBook.key, {
        ...localBook,
        spines: localBook.spines.map((s) =>
          s.cacheKey === cacheKey
            ? { ...s, selected: true }
            : { ...s, selected: false }
        ),
      });
    } else {
      // update book in store, make sure the other spines are not selected
      updateBook(localBook.key, {
        ...localBook,
        spines: localBook.spines.map((s) =>
          s.cacheKey === cacheKey
            ? { ...s, selected: true }
            : { ...s, selected: false }
        ),
      });
    }

    // update spines, match on url set isSelected to true
    setSpines((prev) =>
      prev.map((s) => ({
        ...s,
        isSelected: s.url === url ? true : false,
        cacheKey: s.cacheKey === cacheKey ? cacheKey : s.cacheKey,
      }))
    );

    setLocalBook((prev: Book | null) => {
      if (!prev) return prev;

      return {
        ...prev,
        spines: prev.spines.map((s) => {
          if (s.cacheKey.includes("placeholder")) {
            return { ...s, selected: false }; // deselect placeholder spine
          }
          return s;
        }),
      };
    });
  };

  const onStatusChanged = (value: BookStatus) => {
    if (localBook) {
      localBook.status = value;
      setLocalBook({ ...localBook });
      updateBook(localBook.key, {
        ...localBook,
        status: value,
        dateFinished:
          value === BookStatus.FINISHED ? new Date().toISOString() : undefined,
        dateStarted:
          value === BookStatus.READING ? new Date().toISOString() : undefined,
      });
      if (value === BookStatus.FINISHED) {
        const newBadgeArr = calculateBadgeProgressForCompleteBook(
          localBook,
          badges
        );
        setBadges(newBadgeArr);
      }
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
            <View className="justify-center items-center mt-2 pl-1 pr-1">
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
            <CollapsibleDescription
              description={getBookDescription(localBook)}
            />
          )}
          {remoteBook && (
            <CollapsibleDescription
              description={getBookDescription(remoteBook)}
            />
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
        <View className="h-[1px] bg-gray-200 my-3" />
        <View className="flex-row justify-between">
          <Text className="text-gray-500">Genre</Text>
          <Text>{localBook?.genericGenre}</Text>
        </View>
        <View className="h-[1px] bg-gray-200 my-3" />
        <View className="h-[20px]" />
      </View>

      <View className="h-6 bg-gray-100" />
      {isInLibrary && localBook && (
        <>
          <View className="px-4 bg-gray-100">
            <Text className="text-gray-500 mb-1 ml-1" size="md">
              Reading Status
            </Text>
            <Card>
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-500">Status</Text>
                <InlinePicker
                  dropdownPosition="top"
                  selectedValue={localBook.status}
                  onValueChange={(value: BookStatus) => {
                    onStatusChanged(value);
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
            {localBook.status === "finished" && (
              <>
                <View className="h-6" />
                <Text className="text-gray-500 mb-1 ml-1" size="md">
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
                        { label: "Loved", value: "loved", icon: "heart" },
                        { label: "Liked", value: "liked", icon: "smile-o" },
                        {
                          label: "Disliked",
                          value: "disliked",
                          icon: "frown-o",
                        },
                      ]}
                      label="Status"
                    />
                  </View>
                </Card>
              </>
            )}

            <View className="h-6" />
            <Text className="text-gray-500 mb-1 ml-1" size="md">
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
                  onBlur={() => {
                    if (localBook) {
                      localBook.reviewText = reviewText;
                      setLocalBook({ ...localBook });
                      updateBook(localBook.key, {
                        ...localBook,
                        reviewText: reviewText,
                      });
                    }
                  }}
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
            <Text className="text-gray-500 mb-1 ml-1" size="md">
              Spine Image
            </Text>
            <Card>
              <View className="flex-row">
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-3">
                    {spines?.map((image, index) => (
                      <TouchableOpacity
                        onPress={() =>
                          onSpineSelected(image.url, image.cacheKey)
                        }
                        key={index}
                      >
                        <Image
                          source={{
                            uri: image.url,
                          }}
                          style={[
                            styles.spineImage,
                            image.isSelected && styles.itemSelected,
                          ]}
                          contentFit="contain"
                        />
                      </TouchableOpacity>
                    ))}
                    {localBook.author && coverColors && (
                      <TouchableOpacity
                        onPress={() => onSpineSelected("placeholder")}
                        style={[
                          isPlaceholderSpineSelected ? styles.itemSelected : {},
                        ]}
                      >
                        <PlaceholderBookSpine
                          colors={coverColors}
                          title={localBook.title}
                          author={localBook.author || ""}
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
    width: moderateScale(150),
    height: moderateScale(200),
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
