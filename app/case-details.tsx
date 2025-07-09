import { RadarChart } from "react-native-gifted-charts";
import {
  Radio,
  RadioGroup,
  RadioIndicator,
  RadioLabel,
  RadioIcon,
} from "@/components/ui/radio";
import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
} from "@/components/ui/actionsheet";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ButtonIcon } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { AddIcon, TrashIcon, CircleIcon } from "@/components/ui/icon";
import { isTablet, moderateScale, verticalScale } from "@/utils/scale";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Image, ImageBackground } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import useStore from "@/store";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@/components/ui/text";
import CompactBookShelf from "@/components/CompactBookShelf";
import { Button, ButtonText } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { getWallpaperImages, getWidgetImages } from "@/api";
import { getObjectKeyFromSignedUrl } from "@/utils/image";
import CachedImage, { CacheManager } from "@/components/ChachedImage";
import { BookSortOrder } from "@/models/book";
import { sortBookcase } from "@/utils/bookcase";
import { getRadarChartDataV2 } from "@/utils/books";

const CASE_WIDTH = Dimensions.get("window").width / 2 - (isTablet ? 200 : 40);
const CASE_HEIGHT = verticalScale(isTablet ? 150 : 100);
const SHELF_HEIGHT = verticalScale(isTablet ? 30 : 40);

export default function CaseDetails() {
  const params = useLocalSearchParams();
  const { caseName } = params;
  const { getCaseByName, removeCase, cases, updateCase } = useStore();
  const bookCase = getCaseByName(caseName as string);
  const [showActionsheet, setShowActionsheet] = useState(false);
  const handleClose = () => setShowActionsheet(false);
  const [caseNameInput, setCaseName] = useState<string>(caseName as string);
  const [caseWidgets, setCaseWidgets] = useState<
    { url: string; isSelected: boolean; cacheKey: string }[]
  >([]);
  const [caseWallpapers, setCaseWallpapers] = useState<
    { url: string; isSelected: boolean }[]
  >([]);
  const [sortOrder, setSortOrder] = useState<BookSortOrder>(
    BookSortOrder.DATE_ADDED
  );

  useEffect(() => {
    const init = async () => {
      if (!bookCase) {
        return;
      }
      // get widgets from server
      // get widgets from the bookCase
      // handle rendering both a url and local image

      const widgetUrls = await getWidgetImages();
      const bookCaseWidgets = bookCase?.widgets || [];
      const list = widgetUrls.map((url) => {
        const { bucketName, objectKey } = getObjectKeyFromSignedUrl(url);
        const cacheKey = `${objectKey}-widget`;
        const isSelected = bookCaseWidgets.some(
          (widget) => widget.cacheKey === cacheKey
        );
        return {
          url,
          isSelected,
          cacheKey,
        };
      });

      setCaseWidgets(list);

      // get wallpapers from server
      const wallpaperUrls = await getWallpaperImages();
      const bookCaseWallpaper = bookCase?.wallPaper;

      const wallpaperList = wallpaperUrls.map((url) => {
        const { bucketName, objectKey } = getObjectKeyFromSignedUrl(url);
        const isSelected = bookCaseWallpaper?.url
          ? getObjectKeyFromSignedUrl(bookCaseWallpaper.url).objectKey ===
            objectKey
          : false;
        return {
          url,
          isSelected,
          // cacheKey,
        };
      });
      setCaseWallpapers(wallpaperList);

      // set the sort order
      setSortOrder(bookCase?.sortOrder || BookSortOrder.DATE_ADDED);
    };

    init();
  }, [caseName]);

  const onDeleteCase = () => {
    removeCase(bookCase?.name!);
    router.back();
  };

  const onSelectedWidget = async (widget: {
    url: string;
    isSelected: boolean;
    cacheKey: string;
  }) => {
    // update local state
    // if widget was previously deselected then download as cache
    // add the cache key to the bookCase widgets
    const isSelected = !widget.isSelected;
    setCaseWidgets((prev) =>
      prev.map((w) =>
        w.cacheKey === widget.cacheKey ? { ...w, isSelected: isSelected } : w
      )
    );

    const imageExists = await CacheManager.checkIfCached({
      key: widget.cacheKey,
    });
    if (isSelected && !imageExists) {
      // download the image and add to cache
      await CacheManager.downloadAsync({
        uri: widget.url,
        key: widget.cacheKey,
        options: {},
      });
    }

    if (isSelected) {
      // add the widget to the bookCase widgets
      updateCase(bookCase?.name!, {
        widgets: [...(bookCase?.widgets || []), { cacheKey: widget.cacheKey }],
      });
    }

    if (!isSelected) {
      // remove the widget from the bookCase widgets
      updateCase(bookCase?.name!, {
        widgets: bookCase?.widgets.filter(
          (w) => w.cacheKey !== widget.cacheKey
        ),
      });
    }
  };

  const onSelectedWallpaper = async (wallpaper: {
    url: string;
    isSelected: boolean;
    cacheKey?: string;
  }) => {
    // update local state
    // if wallpaper was previously deselected then download as cache
    // add the cache key to the bookCase wallPaper
    const isSelected = !wallpaper.isSelected;
    // only allow one wallpaper to be selected at a time
    setCaseWallpapers((prev) =>
      prev.map((w) =>
        w.url === wallpaper.url
          ? { ...w, isSelected: isSelected }
          : { ...w, isSelected: false }
      )
    );

    if (isSelected) {
      // add the wallpaper to the bookCase wallPaper
      updateCase(bookCase?.name!, {
        wallPaper: { url: wallpaper.url },
      });
    }

    if (!isSelected) {
      // remove the wallpaper from the bookCase wallPaper
      updateCase(bookCase?.name!, {
        wallPaper: undefined,
      });
    }
  };

  const renderCaseHeader = () => {
    return (
      <>
        {bookCase && (
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "/single-case-display",
                params: {
                  caseName: bookCase.name,
                },
              });
            }}
          >
            <CompactBookShelf
              bookCase={bookCase}
              caseWidth={CASE_WIDTH}
              caseHeight={CASE_HEIGHT}
              shelfHeight={SHELF_HEIGHT}
            />
          </TouchableOpacity>
        )}

        <View className="justify-center items-center mt-2">
          <Heading
            size="xl"
            className="color-typography-white"
            style={{
              textAlign: "center",
            }}
          >
            {bookCase?.name}
          </Heading>
        </View>
        <View className="h-10" />
        {!bookCase?.isDefault && (
          <Button
            className="bg-white rounded-lg"
            onPress={onDeleteCase}
            size="xl"
          >
            <ButtonIcon as={TrashIcon} color="black" />
            <ButtonText>
              <Text>Remove case</Text>
            </ButtonText>
          </Button>
        )}
        <View className="h-5" />
        <Button
          className="bg-white rounded-lg"
          onPress={() => {
            setShowActionsheet(true);
          }}
          size="xl"
        >
          <ButtonIcon as={AddIcon} color="black" />
          <ButtonText>
            <Text>Add Books</Text>
          </ButtonText>
        </Button>
      </>
    );
  };

  const onOrderChanged = (value: BookSortOrder) => {
    setSortOrder(value);

    if (!bookCase) {
      return;
    }

    sortBookcase(bookCase, value);
    updateCase(bookCase?.name!, { books: bookCase?.books, sortOrder: value });
  };

  const radarChartData = useMemo(() => {
    if (!bookCase) return [];

    const books = bookCase.books || [];
    return getRadarChartDataV2(books);
  }, [bookCase?.books]);

  // console.log("Radar Chart Data", radarChartData);

  return (
    <ParallaxScrollView
      parallaxHeaderHeight={300}
      parallaxHeaderContent={() => (
        <>
          {bookCase?.wallPaper?.url ? (
            <ImageBackground
              source={{ uri: bookCase.wallPaper.url }}
              style={{
                width: Dimensions.get("window").width,
                height: verticalScale(450),
                justifyContent: "center",
                alignItems: "center",
              }}
              resizeMode="cover"
            >
              <LinearGradient
                colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0.7)"]}
                style={{
                  ...StyleSheet.absoluteFillObject,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
              {renderCaseHeader()}
            </ImageBackground>
          ) : (
            <LinearGradient
              colors={["rgba(0,0,0,0.5)", "rgba(0,0,0,1)"]}
              style={{
                height: verticalScale(450),
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {renderCaseHeader()}
            </LinearGradient>
          )}
        </>
      )}
    >
      <View style={styles.content}>
        <View className="h-5" />
        {bookCase && bookCase?.books?.length > 0 ? (
          <View className="flex-row flex-wrap" style={{ marginLeft: -3 }}>
            {bookCase?.books.map((book) => (
              <TouchableOpacity
                key={book.key}
                className="rounded-lg p-2"
                onPress={() =>
                  router.push({
                    pathname: "/book-details",
                    params: {
                      localBookKey: book.key,
                    },
                  })
                }
              >
                <Image
                  source={{ uri: book.cover_url }}
                  className="rounded-lg"
                  style={styles.bookImage}
                  contentFit="contain"
                />
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        <View className="h-5" />
        {/* Add radar chart */}
        {radarChartData.length > 0 && bookCase && bookCase.books.length > 2 && (
          <View className="w-100">
            <RadarChart
              gridConfig={{
                fill: "blue",
                gradientColor: "lightblue",
                opacity: 0.2,
                gradientOpacity: 0.1,
              }}
              data={radarChartData.map((item) => item.value)}
              labels={radarChartData.map((item) => item.label)}
              labelConfig={{ fontSize: 12 }}
              labelsPositionOffset={1}
            />
          </View>
        )}
      </View>

      <View className="h-6 bg-gray-100" />
      <View className="px-4 bg-gray-100">
        <Text className="text-gray-500 mb-1 ml-1" size="md">
          Name
        </Text>
        <Card>
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-500">Name</Text>
            <TouchableOpacity className="flex-row items-center">
              <TextInput
                value={caseNameInput}
                onChangeText={(text) => setCaseName(text)}
                placeholder={caseNameInput}
                enterKeyHint="done"
                onSubmitEditing={() => {
                  updateCase(bookCase?.name!, { name: caseNameInput });
                }}
                onBlur={() => {
                  updateCase(bookCase?.name!, { name: caseNameInput });
                }}
                style={{
                  fontSize: moderateScale(14),
                }}
              />
            </TouchableOpacity>
          </View>
        </Card>

        <View className="h-5" />
        <Text className="text-gray-500 mb-1 ml-1" size="md">
          Widgets
        </Text>
        <Card>
          <View className="flex-row">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-3">
                {caseWidgets?.map((widget, index) => (
                  <TouchableOpacity
                    key={widget.url}
                    onPress={() => {
                      onSelectedWidget(widget);
                    }}
                  >
                    <Image
                      className="flex-1"
                      key={index}
                      source={widget.url}
                      style={[
                        styles.widgetImage,
                        widget.isSelected && styles.caseIsSelected,
                      ]}
                      contentFit="contain"
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <View className="h-5" />
            </ScrollView>
          </View>
        </Card>
        <View className="h-5" />
        <Text className="text-gray-500 mb-1 ml-1" size="md">
          Wallpaper
        </Text>
        <Card>
          <View className="flex-row">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-3">
                {caseWallpapers?.map((wallpaper, index) => (
                  <TouchableOpacity
                    key={wallpaper.url}
                    onPress={() => {
                      onSelectedWallpaper(wallpaper);
                    }}
                  >
                    <Image
                      className="flex-1"
                      key={index}
                      source={wallpaper.url}
                      style={[
                        styles.widgetImage,
                        wallpaper.isSelected && styles.caseIsSelected,
                      ]}
                      contentFit="contain"
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <View className="h-5" />
            </ScrollView>
          </View>
        </Card>
        <View className="h-5" />
        <Text className="text-gray-500 mb-1 ml-1" size="md">
          Sort Order
        </Text>
        <Card>
          <View>
            <RadioGroup value={sortOrder} onChange={onOrderChanged}>
              <Radio value={BookSortOrder.DATE_ADDED} size="lg">
                <RadioIndicator>
                  <RadioIcon as={CircleIcon} />
                </RadioIndicator>
                <RadioLabel size="lg">Date Added</RadioLabel>
              </Radio>
              <Radio value={BookSortOrder.TITLE} size="lg">
                <RadioIndicator>
                  <RadioIcon as={CircleIcon} />
                </RadioIndicator>
                <RadioLabel size="lg">Title</RadioLabel>
              </Radio>
              <Radio value={BookSortOrder.AUTHOR} size="lg">
                <RadioIndicator>
                  <RadioIcon as={CircleIcon} />
                </RadioIndicator>
                <RadioLabel size="lg">Author</RadioLabel>
              </Radio>
              {/* <Radio value={BookSortOrder.GENRE} size="lg">
                <RadioIndicator>
                  <RadioIcon as={CircleIcon} />
                </RadioIndicator>
                <RadioLabel>Genre</RadioLabel>
              </Radio> */}
              <Radio value={BookSortOrder.COLOR} size="lg">
                <RadioIndicator>
                  <RadioIcon as={CircleIcon} />
                </RadioIndicator>
                <RadioLabel size="lg">Color</RadioLabel>
              </Radio>
            </RadioGroup>
          </View>
        </Card>
      </View>

      <View className="h-20" />

      <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <ActionsheetItem
            onPress={() => {
              handleClose();
              router.push({
                pathname: "/book-search",
              });
            }}
          >
            <ActionsheetItemText size="lg">Search Books</ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem
            onPress={() => {
              handleClose();
              router.push({
                pathname: "/add-book-scan",
              });
            }}
          >
            <ActionsheetItemText size="lg">Scan Books</ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem
            onPress={() => {
              handleClose();
              router.push({
                pathname: "/add-book-from-library",
                params: {
                  caseName: bookCase?.name,
                },
              });
            }}
          >
            <ActionsheetItemText size="lg">
              Add from Library
            </ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem
          // onPress={() => {
          //   handleClose();
          //   router.push({
          //     pathname: "/add-books-from-case",
          //     params: {
          //       caseName: bookCase?.name,
          //     },
          //   });
          // }}
          >
            <ActionsheetItemText size="lg">
              Move from another case
            </ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: moderateScale(150),
    height: moderateScale(200),
    borderRadius: 10,
  },
  bookImage: {
    width: moderateScale(70),
    height: moderateScale(80),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    padding: 10,
    marginBottom: 10,
  },
  widgetImage: {
    padding: 5,
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: 3,
    marginRight: 10,
    borderColor: "#000",
  },
  caseIsSelected: {
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
