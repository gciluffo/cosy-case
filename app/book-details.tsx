import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import useStore from "@/store";
import { useLocalSearchParams } from "expo-router";

export default function BookDetails() {
  const { removeBook, getBookByKey } = useStore();
  const params = useLocalSearchParams();
  const { bookKey } = params;
  const book = getBookByKey(bookKey as string);

  return (
    <View>
      <Text>Book Details</Text>
      <Button size="xl" onPress={() => removeBook(bookKey as string)}>
        <ButtonText>Remove book</ButtonText>
      </Button>
    </View>
  );
}
