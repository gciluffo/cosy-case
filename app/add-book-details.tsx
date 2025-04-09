import { Card } from "@/components/ui/card";
import { OpenLibraryBook, OpenLibraryBookSearch } from "@/models/external";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { Text } from "@/components/ui/text";

export default function AddBookDetails() {
  const params = useLocalSearchParams();
  const book: OpenLibraryBook & OpenLibraryBookSearch = JSON.parse(
    params.book as string
  );

  return (
    <View>
      <Text className="text-gray-500 mb-1 ml-1" size="lg">
        Review
      </Text>
      <Card>
        <View className="flex-row justify-between">
          <Text className="text-gray-500">Status</Text>
          <Text>
            fowpekfpokwepfokwepof kwepfok wpeofkwpeofkwpoefkpw oekfpwoekf
          </Text>
        </View>
      </Card>
    </View>
  );
}
