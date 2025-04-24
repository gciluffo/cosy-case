import { Heading } from "@/components/ui/heading";
import { BookCase } from "@/models/book";
import useStore from "@/store";
import { scale, verticalScale } from "@/utils/scale";
import FontAwesome from "@expo/vector-icons/build/FontAwesome";
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Text } from "@/components/ui/text";
import CompactBookShelf from "@/components/CompactBookShelf";
import { Shelf } from "@/components/Shelf";

export default function CaseSettings() {
  const { cases } = useStore();

  const renderShelf = (bookCase: BookCase) => {
    return (
      <>
        {[1, 2, 3].map((shelfBooks, index) => {
          return (
            <Shelf
              index={index}
              bookCase={bookCase}
              width={scale(100)}
              height={verticalScale(33)}
              numShelves={3}
            >
              <View></View>
            </Shelf>
          );
        })}
      </>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Heading>Cases</Heading>
      <View className="h-5" />
      <FlatList
        horizontal={true}
        data={cases}
        ItemSeparatorComponent={() => {
          return <View className="m-10" />;
        }}
        renderItem={({ item, index }) => (
          <View className="flex" key={item.name}>
            <View style={[item.isSelected && styles.caseIsSelected]}>
              <CompactBookShelf
                bookCase={item}
                caseWidth={scale(120)}
                caseHeight={verticalScale(100)}
                shelfHeight={verticalScale(33)}
              />
              {/* {renderShelf(item)} */}
            </View>
            <Text>{item.name}</Text>
          </View>
        )}
        ListFooterComponent={() => {
          return (
            <TouchableOpacity style={styles.addCaseButton}>
              <FontAwesome name="plus" size={20} color="gray" />
            </TouchableOpacity>
          );
        }}
      />
      <View className="h-10" />
      <Heading>Case Settings</Heading>
      <View className="h-5" />
      <Text className="color-gray-600">Name</Text>
      <View className="h-20 bg-slate-300"></View>
      <View className="h-5" />
      <Text className="color-gray-600">Scale</Text>
      <View className="h-20 bg-slate-300"></View>
      <View className="h-5" />
      <Text className="color-gray-600">Widgets</Text>
      <View className="h-20 bg-slate-300"></View>
      <View className="h-5" />
      <Text className="color-gray-600">Sort Order</Text>
      <View className="h-20 bg-slate-300"></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingBottom: 60,
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
