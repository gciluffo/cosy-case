import ScollViewFloatingButton from "@/components/ScrollViewFloatingButton";
import { Card } from "@/components/ui/card";
import useStore from "@/store";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Image } from "expo-image";
import CachedImage from "@/components/ChachedImage";
import { isTablet, moderateScale } from "@/utils/scale";
import { router } from "expo-router";

export default function TabTwoScreen() {
  const { books } = useStore();

  return (
    <FlatList
      contentContainerStyle={{
        paddingBottom: 100,
        marginHorizontal: isTablet ? moderateScale(100) : 0,
      }}
      style={styles.list}
      data={books}
      numColumns={3}
      ItemSeparatorComponent={() => <View style={{ marginVertical: 10 }} />}
      renderItem={({ item }) => (
        // <CachedImage />
        <TouchableOpacity
          className="rounded-lg p-2"
          onPress={() =>
            router.push({
              pathname: "/book-details",
              params: {
                bookKey: item.key,
              },
            })
          }
        >
          <Image
            source={{ uri: item.cover_url }}
            className="rounded-lg"
            style={styles.image}
            contentFit="contain"
          />
          {/* <Text
            className="text-gray-500"
            style={{
              maxWidth: 110,
            }}
          >
            {item.title}
          </Text> */}
        </TouchableOpacity>
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
    width: 110,
    height: 150,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  list: {
    padding: 10,
    marginBottom: 10,
  },
});
