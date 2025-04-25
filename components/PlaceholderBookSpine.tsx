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
      {/* <View
        style={{
          height: 0,
          width: "100%",
          borderStyle: "dashed",
          borderWidth: 1,
          borderColor: colors.secondary,
        }}
      /> */}
      <View
        style={{
          transform: [{ rotate: "90deg" }],
          width: height, // Swap width and height for rotated text
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: isColorDark(colors.primary) ? "#fff" : "#000",
            fontSize: 16,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            color: isColorDark(colors.primary) ? "#fff" : "#000",
            fontSize: 14,
            textAlign: "center",
          }}
        >
          {author}
        </Text>
      </View>
    </ViewShot>
  );
}

const styles = StyleSheet.create({
  container: {},
});
