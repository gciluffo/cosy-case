import { Button, ButtonText } from "@/components/ui/button";
import { View, StyleSheet } from "react-native";
import { Text } from "@/components/ui/text";
import { Image } from "expo-image";
import useStore from "@/store";
import { router } from "expo-router";
import { Heading } from "@/components/ui/heading";
import { scale } from "@/utils/scale";

export default function IntroSingleBookSpineCamera() {
  const { updateUser } = useStore();

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        paddingTop: 50,
      }}
    >
      <Heading size="3xl">Book Spine Pictures</Heading>
      <Image
        source={require("@/assets/images/taking-book-spine-picture.png")}
        style={{ width: scale(300), height: scale(300) }}
      />
      <Text size="lg" style={{ textAlign: "center" }} bold>
        Try to align the book spine vertically in the center of the camera view.
      </Text>

      <Text size="lg" style={{ textAlign: "center", marginTop: 10 }} bold>
        Dont worry about it being perfectly straight. We'll crop the spine for
        you.
      </Text>

      <Button
        size="xl"
        style={styles.button}
        onPress={() => {
          updateUser({ introToBookSpinePicturesCompleted: true });
          router.back();
        }}
      >
        <ButtonText>Got It</ButtonText>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryContainer: {},
  ingredientChipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  button: {
    position: "absolute",
    bottom: 20,
    padding: 12,
    borderRadius: 8,
    height: 50,
    margin: 10,
    width: "95%",
  },
  keyboardButton: {
    margin: 10,
    alignSelf: "flex-end",
    borderRadius: 10,
  },
});
