import ScollViewFloatingButton from "@/components/ScrollViewFloatingButton";
import { Card } from "@/components/ui/card";
import useStore from "@/store";
import { FlatList, StyleSheet, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Image } from "expo-image";
import CachedImage from "@/components/ChachedImage";

export default function TabTwoScreen() {
  const { books } = useStore();

  return (
    <FlatList
      className="flex-1"
      contentContainerStyle={{
        padding: 10,
      }}
      data={books}
      numColumns={3}
      renderItem={({ item }) => (
        // <CachedImage />
        <View className="flex-col ">
          <Image
            source={{ uri: item.cover_url }}
            className="w-40 h-60 rounded-lg"
            style={styles.image}
            contentFit="cover"
          />
          <View className="flex-row justify-between mt-2">
            <Text className="text-gray-500">{item.title}</Text>
            {/* <Text className="text-gray-500">{item.author}</Text> */}
          </View>
        </View>
      )}
      keyExtractor={(item) => item.key}
    />
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  image: {
    // width: 100,
    height: 150,
    borderRadius: 10,
  },
});
