import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import FontAwesome from "@expo/vector-icons/build/FontAwesome";

interface Props {
  image: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function CroppedImageConfirm(props: Props) {
  const { image, onConfirm, onCancel } = props;

  return (
    <View style={styles.container}>
      <Image
        style={{
          marginTop: 20,
          height: "80%",
          width: "auto",
        }}
        source={{ uri: image }}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onCancel}>
          <FontAwesome name="times" size={24} color="red" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onConfirm}>
          <FontAwesome name="check" size={24} color="green" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "black",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 30,
  },
  button: {
    width: 70,
    height: 70,
    backgroundColor: "white",
    borderRadius: 35,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
