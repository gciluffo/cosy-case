import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Text } from "@/components/ui/text";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { AddIcon } from "./ui/icon";
import { useState } from "react";

interface Props {
  title: string;
  author?: string;
  imageUrl: string;
  onAddToLibrary: () => void;
  isBookAlreadyInLibrary: () => boolean;
  rating?: number;
}

export default function BookSearchResult(props: Props) {
  const [noImage, setNoImage] = useState(false);

  const {
    title,
    imageUrl,
    rating,
    onAddToLibrary,
    author,
    isBookAlreadyInLibrary,
  } = props;

  return (
    <View className="flex flex-row items-center gap-2 p-1">
      {noImage || !imageUrl ? (
        <View style={[styles.image, { backgroundColor: "lightgrey" }]}></View>
      ) : (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          contentFit="contain"
          onLoad={(event) => {
            const { width, height } = event.source;
            if (width === 1 && height === 1) {
              setNoImage(true);
            }
          }}
          onError={() => setNoImage(true)}
          cachePolicy={"memory-disk"}
        />
      )}
      <View className="flex-[2]">
        <Text className="text-base font-semibold">{props.title}</Text>
        {props.author && (
          <Text className="text-sm text-gray-500">{props.author}</Text>
        )}
        {props.rating && (
          <Text className="text-sm text-gray-500">Rating: {props.rating}</Text>
        )}
      </View>
      <View className="flex-[1] space-y-1">
        <Button
          disabled={isBookAlreadyInLibrary()}
          className="p-2 rounded-md"
          onPress={onAddToLibrary}
        >
          <ButtonIcon as={AddIcon} />
          <ButtonText>Add</ButtonText>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 80,
    height: 100,
    borderRadius: 8,
  },
});
