import { View, StyleSheet } from "react-native";
import ViewShot from "react-native-view-shot";
import { Text } from "@/components/ui/text";
import { isColorDark } from "@/utils/color";

interface Props {
  colors: {
    primary: string;
    secondary: string;
  };
  title: string;
  author: string;
  width?: number;
  height?: number;
  viewRef: React.RefObject<any>;
}

export default function PlaceholderBookSpine(props: Props) {
  const { colors, title, author, width = 50, height = 250, viewRef } = props;

  return (
    <ViewShot
      ref={viewRef}
      style={{
        width: width,
        height: height,
        backgroundColor: colors.primary,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: colors.secondary,
          position: "absolute",
          top: 20,
        }}
      ></View>
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: colors.secondary,
          position: "absolute",
          top: 15,
        }}
      ></View>
      <View
        style={{
          transform: [{ rotate: "90deg" }],
          width: height,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: isColorDark(colors.primary) ? "#fff" : "#000",
            fontSize: 12,
            fontWeight: "bold",
            textAlign: "center",
            lineHeight: 13,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            color: isColorDark(colors.primary) ? "#fff" : "#000",
            fontSize: 12,
            textAlign: "center",
          }}
        >
          {author}
        </Text>
      </View>
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: colors.secondary,
          position: "absolute",
          bottom: 20,
        }}
      ></View>
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: colors.secondary,
          position: "absolute",
          bottom: 15,
        }}
      ></View>
    </ViewShot>
  );
}

const styles = StyleSheet.create({
  container: {},
});
