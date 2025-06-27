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
import { AddIcon, TrashIcon } from "@/components/ui/icon";
import { isTablet, moderateScale, scale, verticalScale } from "@/utils/scale";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  SwitchChangeEvent,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import useStore from "@/store";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@/components/ui/text";
import CompactBookShelf from "@/components/CompactBookShelf";
import { Button, ButtonText } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import colors from "tailwindcss/colors";
import { Card } from "@/components/ui/card";
import { getWidgetImages } from "@/api";
import { getObjectKeyFromSignedUrl } from "@/utils/image";
import CachedImage, { CacheManager } from "@/components/ChachedImage";

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
        const { bucketName } = getObjectKeyFromSignedUrl(url);
        const cacheKey = `${bucketName}-widget`;
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

  return (
    <ParallaxScrollView
      parallaxHeaderHeight={300}
      parallaxHeaderContent={() => (
        <>
          <LinearGradient
            colors={["rgba(0,0,0,0.5)", "rgba(0,0,0,1)"]}
            style={{
              height: verticalScale(450),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {bookCase && (
              <CompactBookShelf
                bookCase={bookCase}
                caseWidth={CASE_WIDTH}
                caseHeight={CASE_HEIGHT}
                shelfHeight={SHELF_HEIGHT}
              />
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
          </LinearGradient>
        </>
      )}
    >
      <View style={styles.content}>
        <View className="h-5" />
        <Heading>Books</Heading>
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
    width: moderateScale(62),
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
    borderWidth: 1,
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
