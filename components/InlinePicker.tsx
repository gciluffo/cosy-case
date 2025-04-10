import { scale } from "@/utils/scale";
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const InlinePicker = ({ label, selectedValue, onValueChange, items }) => {
  return (
    <View style={styles.container}>
      <Dropdown
        data={items}
        labelField="label"
        valueField="value"
        value={selectedValue}
        onChange={(item) => onValueChange(item.value)}
        containerStyle={styles.dropdownContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "25%",
  },
  label: {
    marginBottom: 4,
    fontSize: 16,
    fontWeight: "bold",
  },
  dropdownContainer: {
    borderRadius: 6,
    width: 200,
    // shift container to the left a little
    marginLeft: scale(-80),
  },
});

export default InlinePicker;
