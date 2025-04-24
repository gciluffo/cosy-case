import Entypo from "@expo/vector-icons/Entypo";
import { scale } from "@/utils/scale";
import React from "react";
import { View, StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { FontAwesome } from "@expo/vector-icons"; // Example: Using Ionicons for the custom icon
import { Text } from "@/components/ui/text";

interface Props {
  label: string;
  selectedValue: string;
  onValueChange: React.Dispatch<React.SetStateAction<any>>;
  items: Array<{ icon: string; label: string; value: string }>;
}

const InlinePicker = (props: Props) => {
  const { label, selectedValue, onValueChange, items } = props;

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
        placeholderStyle={styles.placeholder}
        selectedTextStyle={styles.selectedText}
        renderRightIcon={() => (
          <Entypo name="select-arrows" size={18} color="black" />
        )}
        renderLeftIcon={() => (
          // get icon from selected time
          <FontAwesome
            name={items.find((i) => i.value === selectedValue)?.icon as any}
            size={18}
            color="black"
            style={{ marginRight: 5 }}
          />
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
  container: {
    width: "32%",
  },
  dropdownContainer: {
    borderRadius: 6,
    width: 200,
    marginLeft: scale(-80),
  },
  dropdown: {
    // paddingHorizontal: 10, // Adjust padding to reduce space
  },
  placeholder: {
    fontSize: 14,
    color: "#999",
  },
  selectedText: {
    fontSize: 14,
    textAlign: "left", // Ensure text aligns properly
    paddingRight: 0, // Remove extra padding near the arrow
  },
});

export default InlinePicker;
