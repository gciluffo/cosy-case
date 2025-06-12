import { Shelf } from "@/components/Shelf";
import colors from "tailwindcss/colors";
import { BookCase } from "@/models/book";
import { BOOK_CASES } from "@/utils/bookcase";
import { scale, verticalScale } from "@/utils/scale";
import { useEffect, useState } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Text } from "@/components/ui/text";
import useStore from "@/store";
import ScollViewFloatingButton from "@/components/ScrollViewFloatingButton";
import { router } from "expo-router";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Image } from "expo-image";
import { getWidgetImages } from "@/api";
import { getObjectKeyFromSignedUrl } from "@/utils/image";
import { CacheManager } from "@/components/ChachedImage";

export default function AddCase() {
  const { addCase, cases, updateCase } = useStore();
  const [bookCases, setBookCases] = useState<BookCase[]>(BOOK_CASES);
  const [caseName, setCaseName] = useState<string>(`case ${cases.length + 1}`);
  const [caseWidgets, setCaseWidgets] = useState<
    { url: string; isSelected: boolean }[]
  >([]);
  const [isDefault, setIsDefault] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      const widgetUrls = await getWidgetImages();
      const list = widgetUrls.map((url) => ({
        url,
        isSelected: false,
      }));
      setCaseWidgets(list);
    };
    init();
  }, []);

  const renderShelf = (bookCase: BookCase) => {
    return (
      <>
        {[1, 2, 3].map((shelfBooks, index) => {
          return (
            <Shelf
              index={index}
              bookCase={bookCase}
              width={scale(100)}
              height={verticalScale(33)}
              numShelves={3}
            >
              <View></View>
            </Shelf>
          );
        })}
      </>
    );
  };

  const onAddCase = async () => {
    if (isLoading) return;
    setIsLoading(true);

    const selectedStyle = bookCases.find((c) => c.isSelected);
    const selectedWidgets = caseWidgets.filter((w) => w.isSelected);

    for (const w of selectedWidgets) {
      const { bucketName } = getObjectKeyFromSignedUrl(w.url);
      const cacheKey = `${bucketName}-widget`;

      await CacheManager.downloadAsync({
        uri: w.url,
        key: cacheKey,
        options: {},
      });
    }

    const newCase: BookCase = {
      name: caseName,
      topImageKey: selectedStyle!.topImageKey,
      middleImageKey: selectedStyle!.middleImageKey,
      bottomImageKey: selectedStyle!.bottomImageKey,
      offsetXPercent: selectedStyle!.offsetXPercent,
      offsetYPercent: selectedStyle!.offsetYPercent,
      isSelected: isDefault,
      books: [],
      isDefault: false,
      widgets: selectedWidgets.map((w) => {
        const { bucketName } = getObjectKeyFromSignedUrl(w.url);
        const cacheKey = `${bucketName}-widget`;
        return {
          cacheKey,
        };
      }),
    };

    // if case is default then set the others to false
    if (newCase.isDefault) {
      for (const c of cases) {
        updateCase(c.name, { isSelected: false });
      }
    }

    addCase(newCase);

    setIsLoading(false);
    router.back();
  };

  return (
    <ScollViewFloatingButton
      onPress={() => onAddCase()}
      buttonText="Add Bookcase"
      loading={isLoading}
    >
      <Text className="text-gray-500 mb-1 ml-1" size="lg">
        Case
      </Text>
      <FlatList
        horizontal={true}
        data={bookCases}
        ItemSeparatorComponent={() => {
          return <View className="m-10" />;
        }}
        renderItem={({ item, index }) => (
          <View className="flex" key={item.name}>
            <TouchableOpacity
              style={[item.isSelected && styles.caseIsSelected]}
            >
              {renderShelf(item)}
            </TouchableOpacity>
          </View>
        )}
      />
      <View className="h-10" />
      <Text className="text-gray-500 mb-1 ml-1" size="lg">
        Name
      </Text>
      <Card>
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-500">Name</Text>
          <TouchableOpacity className="flex-row items-center">
            <TextInput
              value={caseName}
              onChangeText={(text) => setCaseName(text)}
              placeholder={caseName}
            />
          </TouchableOpacity>
        </View>
      </Card>
      <View className="h-5" />
      <Text className="text-gray-500 mb-1 ml-1" size="lg">
        Default Display
      </Text>
      <Card>
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-500">Default Display</Text>
          <Switch
            size="md"
            isDisabled={false}
            trackColor={{
              false: colors.neutral[300],
              true: colors.neutral[600],
            }}
            thumbColor={colors.neutral[50]}
            ios_backgroundColor={colors.neutral[300]}
            value={isDefault}
            onChange={(event) => setIsDefault(event.nativeEvent.value)}
          />
        </View>
      </Card>
      <View className="h-5" />
      <Text className="text-gray-500 mb-1 ml-1" size="lg">
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
                    const updatedWidgets = caseWidgets.map((w, i) => ({
                      ...w,
                      isSelected: !w.isSelected,
                    }));
                    setCaseWidgets(updatedWidgets);
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

      {/* <View className="h-20 bg-slate-300"></View>
      <View className="h-5" />
      <Text className="color-gray-600">Scale</Text>
      <View className="h-20 bg-slate-300"></View>
      <View className="h-5" />
      <Text className="color-gray-600">Widgets</Text>
      <View className="h-20 bg-slate-300"></View>
      <View className="h-5" />
      <Text className="color-gray-600">Sort Order</Text>
      <View className="h-20 bg-slate-300"></View> */}
    </ScollViewFloatingButton>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingBottom: 60,
    flex: 1,
  },
  caseContainer: {},
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
  widgetImage: {
    width: 100,
    height: 100,
    borderRadius: 3,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#000",
  },
});
