import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { Text } from "@/components/ui/text";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { AddIcon } from "./ui/icon";
import { useState } from "react";
import { convertToHttps } from "@/utils/image";

interface Props {
  title: string;
  author?: string;
  imageUrl?: string;
  onAddToLibrary: () => void;
  onNoImage?: () => void;
  isBookAlreadyInLibrary: boolean;
  rating?: number;
  loading?: boolean;
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
    loading = false,
  } = props;

  return (
    <View className="flex flex-row items-center gap-2 p-1">
      {loading && !imageUrl ? (
        <ActivityIndicator size="small" color="black" style={styles.image} />
      ) : noImage || !imageUrl ? (
        <View style={[styles.image, { backgroundColor: "lightgrey" }]}></View>
      ) : (
        <Image
          source={{ uri: convertToHttps(imageUrl) }}
          style={styles.image}
          contentFit="contain"
          onLoad={(event) => {
            const { width, height } = event.source;
            if (width === 1 && height === 1) {
              setNoImage(true);
              if (props.onNoImage) {
                props.onNoImage();
              }
            }
          }}
          onError={(e) => {
            setNoImage(true);
            if (props.onNoImage) {
              props.onNoImage();
            }
          }}
          cachePolicy={"memory-disk"}
        />
      )}
      <View className="flex-[2]">
        <Text className="font-semibold">{props.title}</Text>
        {props.author && (
          <Text size="sm" className="text-gray-500">
            {props.author}
          </Text>
        )}
        {props.rating && (
          <Text className="text-sm text-gray-500">Rating: {props.rating}</Text>
        )}
      </View>
      <View className="flex-[1] space-y-1">
        <Button
          className="p-2 rounded-md"
          disabled={isBookAlreadyInLibrary}
          style={
            isBookAlreadyInLibrary && {
              backgroundColor: "lightgrey",
              borderColor: "lightgrey",
              borderWidth: 1,
            }
          }
          onPress={onAddToLibrary}
        >
          {isBookAlreadyInLibrary ? (
            <ButtonText>In Library</ButtonText>
          ) : (
            <>
              <ButtonIcon as={AddIcon} />
              <ButtonText>Add</ButtonText>
            </>
          )}
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
