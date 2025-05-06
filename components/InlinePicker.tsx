import Entypo from "@expo/vector-icons/Entypo";
import { scale } from "@/utils/scale";
import React from "react";
import { View, StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { FontAwesome } from "@expo/vector-icons"; // Example: Using Ionicons for the custom icon
import { Text } from "@/components/ui/text";
import { captializeFirstLetter } from "@/utils/string";

interface Props {
  label: string;
  selectedValue: string;
  onValueChange: React.Dispatch<React.SetStateAction<any>>;
  items: Array<{ icon: string; label: string; value: string }>;
  dropdownPosition: "top" | "bottom";
}

const InlinePicker = (props: Props) => {
  const { label, selectedValue, onValueChange, items, dropdownPosition } =
    props;

  return (
    <View style={styles.container}>
      <Dropdown
        data={items}
        labelField="label"
        valueField="value"
        value={selectedValue}
        onChange={(item) => onValueChange(item.value)}
        containerStyle={styles.dropdownContainer}
        style={styles.dropdown}
        dropdownPosition={dropdownPosition}
        renderRightIcon={() => (
          <Entypo name="select-arrows" size={18} color="black" />
        )}
        renderLeftIcon={() => (
          <View className="flex-row items-center">
            <FontAwesome
              name={items.find((i) => i.value === selectedValue)?.icon as any}
              size={18}
              color="black"
              style={{ marginRight: 5 }}
            />
            <Text>{items.find((i) => i.value === selectedValue)?.label}</Text>
          </View>
        )}
        renderItem={(item) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 10,
            }}
          >
            <FontAwesome
              name={item.icon}
              size={18}
              color="black"
              style={{ marginRight: 5 }}
            />
            <Text>{item.label}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  dropdownContainer: {
    // borderRadius: 6,
    width: 120,
    marginLeft: scale(-10),
  },
  dropdown: {},
});

export default InlinePicker;
