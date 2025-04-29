import { Heading } from "@/components/ui/heading";
import { BookCase } from "@/models/book";
import useStore from "@/store";
import { scale, verticalScale } from "@/utils/scale";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Text } from "@/components/ui/text";
import CompactBookShelf from "@/components/CompactBookShelf";
import { router } from "expo-router";

const CASE_WIDTH = Dimensions.get("window").width / 2 - 20;
const CASE_HEIGHT = verticalScale(100);
const SHELF_HEIGHT = verticalScale(33);

export default function CaseSettings() {
  const { cases } = useStore();

  return (
    <FlatList
      data={cases}
      numColumns={2}
      columnWrapperStyle={{
        justifyContent: "space-around",
      }}
      contentContainerStyle={styles.container}
      ItemSeparatorComponent={() => <View style={{ marginVertical: 10 }} />}
      renderItem={({ item, index }) => (
        <TouchableOpacity
          className="flex"
          key={item.name}
          onPress={() => {
            router.push({
              pathname: "/case-details",
              params: {
                caseName: item.name,
              },
            });
          }}
        >
          <CompactBookShelf
            bookCase={item}
            caseWidth={CASE_WIDTH}
            caseHeight={CASE_HEIGHT}
            shelfHeight={SHELF_HEIGHT}
          />
          <Text>{item.name}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingBottom: 60,
    flex: 1,
  },
  caseIsSelected: {
    borderWidth: 3,
    borderColor: "#007AFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 3,
  },
  addCaseButton: {
    marginLeft: 10,
    width: 80,
    height: verticalScale(33) * 3,
    borderRadius: 25,
    backgroundColor: "lightgrey",
    justifyContent: "center",
    alignItems: "center",
  },
});
