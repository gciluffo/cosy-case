import CollapsibleDescription from "@/components/CollapsibleDescription";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { TrashIcon, AddIcon } from "@/components/ui/icon";
import { scale, verticalScale } from "@/utils/scale";
import { View, StyleSheet, Dimensions } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import useStore from "@/store";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@/components/ui/text";
import CompactBookShelf from "@/components/CompactBookShelf";

const CASE_WIDTH = Dimensions.get("window").width / 2 - 20;
const CASE_HEIGHT = verticalScale(100);
const SHELF_HEIGHT = verticalScale(33);

export default function CaseDetails() {
  const params = useLocalSearchParams();
  const { caseName } = params;
  const { getCaseByName } = useStore();
  const bookCase = getCaseByName(caseName as string);

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
            {/* {isInLibrary() ? (
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
            )} */}
          </LinearGradient>
        </>
      )}
    >
      <View style={styles.content}>
        <Heading>Description</Heading>
        <View className="h-5" />
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
