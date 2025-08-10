import Badge from "@/components/Badge";
import { Image } from "expo-image";
import { Text } from "@/components/ui/text";
import { BadgeType } from "@/models/badge";
import useStore from "@/store";
import { BadgeDescription } from "@/utils/badges";
import { moderateScale, scale } from "@/utils/scale";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, TouchableOpacity, View, StyleSheet } from "react-native";

export default function BadgeDetails() {
  const { badges } = useStore();
  const params = useLocalSearchParams();
  const badgeType = params.type as BadgeType;
  const localBadge = badges.find((b) => b.type === badgeType);
  const progress = localBadge?.progress || 0;

  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: 100,
      }}
      className="p-3 mt-5"
    >
      <View className="h-20" />
      <View className="flex-1 items-center">
        <Badge
          key={badgeType}
          type={badgeType}
          progress={progress}
          width={scale(150)}
          height={scale(150)}
          fullOpacity={true}
        />
        <View className="h-5" />
        <Text>{BadgeDescription[badgeType]}</Text>
        <View className="h-5" />
        <View
          style={{
            width: "100%",
            height: 1,
            backgroundColor: "#ccc",
            marginVertical: 10,
          }}
        />
      </View>
      {localBadge?.books && localBadge.books.length > 0 ? (
        <View className="flex-row flex-wrap" style={{ marginLeft: -3 }}>
          {localBadge?.books.map((book) => (
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
                cachePolicy={"memory-disk"}
              />
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bookImage: {
    width: moderateScale(90),
    height: moderateScale(120),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
