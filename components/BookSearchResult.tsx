import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Text } from "@/components/ui/text";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { AddIcon } from "./ui/icon";

interface Props {
  title: string;
  author?: string;
  imageUrl: string;
  onAddToLibrary: () => void;
  rating?: number;
}

export default function BookSearchResult(props: Props) {
  const { title, imageUrl, rating, onAddToLibrary, author } = props;

  return (
    <View className="flex flex-row items-center gap-2 p-1">
      <Image
        source={imageUrl}
        style={styles.image}
        className="flex-1"
        // resizeMode="cover"
      />
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
        <Button className="p-2 rounded-md" onPress={onAddToLibrary}>
          <ButtonIcon as={AddIcon} className="ml-2" />
          <ButtonText className="text-sm">Add</ButtonText>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 80,
    height: 100,
    // borderRadius: 8,
  },
});
