import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Text } from "@/components/ui/text";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import useStore from "@/store";
import { router, useLocalSearchParams } from "expo-router";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { getPrimaryAndSecondaryColors } from "@/utils/image";
import { scale, verticalScale } from "@/utils/scale";
import { Heading } from "@/components/ui/heading";
import { LinearGradient } from "expo-linear-gradient";
import { TrashIcon } from "@/components/ui/icon";
import { CacheManager } from "@/components/ChachedImage";
import { Book } from "@/models/book";
import { getBookDetails } from "@/api";
import { OpenLibraryBook } from "@/models/open-library";
import CollapsibleDescription from "@/components/CollapsibleDescription";

export default function BookDetails() {
  const [localBook, setLocalBook] = useState<Book | null>(null);
  const [remoteBook, setRemoteBook] = useState<OpenLibraryBook | null>(null);
  const [loading, setLoading] = useState(false);
  const [coverColors, setColorCovers] = useState<{
    primary: string;
    secondary: string;
  } | null>(null);
  const { removeBook, getBookByKey } = useStore();
  const params = useLocalSearchParams();
  const { localBookKey, bookKey } = params;

  useEffect(() => {
    const init = async () => {
      try {
        if (localBookKey) {
          const book = getBookByKey(localBookKey as string);
          if (book) {
            console.log("Book found in local storage", book);
            setLocalBook(book);
          }
        }

        // if bookKey is not null, get the book from api
        if (bookKey) {
          setLoading(true);
          const book = await getBookDetails(bookKey as string);
          setRemoteBook(book);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
      // if localBookKey is not null, get the book from the store
    };

    init();
  }, [localBookKey, bookKey]);

  //   console.log({
  //     localBook,
  //     remoteBook,
  //   });

  // TODO: Remove
  useEffect(() => {
    const bookSpinePrimaryColorInit = async () => {
      if (coverColors) {
        return;
      }

      if (localBook?.colors) {
        setColorCovers(localBook?.colors);
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
          cover_url: book.cover_url,
        }),
      },
    });
  };

  const isInLibrary = () => {
    const book = getBookByKey((localBookKey as string) || (bookKey as string));
    return !!book;
  };

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
              source={localBook?.cover_url || remoteBook?.cover_url}
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
            {isInLibrary() ? (
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
                  <ButtonIcon as={TrashIcon} color="black" />
                  <ButtonText>
                    <Text>Remove from library</Text>
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

      {/* Show book spine management stuff here? */}
      <View></View>
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
});
