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
import { scale, verticalScale } from "@/utils/scale";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  SwitchChangeEvent,
} from "react-native";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import useStore from "@/store";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@/components/ui/text";
import CompactBookShelf from "@/components/CompactBookShelf";
import { Button, ButtonText } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import colors from "tailwindcss/colors";
import FontAwesome from "@expo/vector-icons/build/FontAwesome";

const CASE_WIDTH = Dimensions.get("window").width / 2 - 20;
const CASE_HEIGHT = verticalScale(100);
const SHELF_HEIGHT = verticalScale(33);

export default function CaseDetails() {
  const params = useLocalSearchParams();
  const { caseName } = params;
  const { getCaseByName, removeCase, cases, updateCase } = useStore();
  const bookCase = getCaseByName(caseName as string);
  const [showActionsheet, setShowActionsheet] = useState(false);
  const handleClose = () => setShowActionsheet(false);
  const [caseNameInput, setCaseName] = useState<string>(caseName as string);
  const [isDefault, setIsDefault] = useState(bookCase?.isSelected);

  console.log("bookCase", {
    name: bookCase?.name,
    isSelected: bookCase?.isSelected,
  });

  const onDefaultCaseSelected = (event: SwitchChangeEvent) => {
    const isDefault = event.nativeEvent.value;
    // update selected case to this value/
    // if true, de-selected all other cases in state
    // if false, set default case to selected
    for (const c of cases) {
      updateCase(c.name, { isSelected: false });
    }

    if (isDefault) {
      updateCase(bookCase?.name!, { isSelected: true });
    } else {
      updateCase("default", { isSelected: true });
    }

    setIsDefault(isDefault);
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
            {bookCase?.name !== "default" && (
              <Button
                className="bg-white rounded-lg"
                onPress={() => {
                  removeCase(bookCase?.name!);
                  router.back();
                }}
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
        {bookCase?.name !== "default" && (
          <View className="flex-row justify-between items-center">
            {/* <Text className="text-gray-500">Default Display</Text> */}
            <Heading>Default Display</Heading>
            <Switch
              size="md"
              trackColor={{
                false: colors.neutral[300],
                true: colors.neutral[600],
              }}
              thumbColor={colors.neutral[50]}
              ios_backgroundColor={colors.neutral[300]}
              value={isDefault}
              onChange={onDefaultCaseSelected}
            />
          </View>
        )}

        <View className="h-5" />
        <View className="flex-row justify-between items-center">
          {/* <Text className="text-gray-500">Name</Text> */}
          <Heading>Name</Heading>
          <TouchableOpacity className="flex-row items-center">
            <TextInput
              value={caseNameInput}
              onChangeText={(text) => setCaseName(text)}
              placeholder={caseNameInput}
              style={{}}
            />
          </TouchableOpacity>
        </View>
        <View className="h-5" />
        <Heading>Books</Heading>
        {bookCase && bookCase?.books?.length > 0 ? (
          <View className="flex-row flex-wrap gap-1">
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
          <ActionsheetItem onPress={handleClose}>
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
    width: scale(150),
    height: scale(200),
    borderRadius: 10,
  },
  bookImage: {
    width: scale(62),
    height: scale(80),
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
});
