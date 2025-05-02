import { useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SearchIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";

interface Props {
  value: string;
  setSearchText: (text: string) => void;
  onCancel: () => void;
}

export default function SearchInput(props: Props) {
  const { value, setSearchText, onCancel } = props;
  const [isFocused, setIsFocused] = useState(false);

  const handleCancel = () => {
    setIsFocused(false);
    Keyboard.dismiss();
    onCancel();
  };

  return (
    <View style={styles.container}>
      <Input style={[styles.searchInput, isFocused && styles.focusedInput]}>
        <InputSlot className="pl-3">
          <InputIcon as={SearchIcon} />
        </InputSlot>
        <InputField
          value={value}
          placeholder="Search by book title and/or author"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => {
            setSearchText(e.nativeEvent.text);
          }}
        />
      </Input>
      {isFocused && (
        <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
    // margin: 10,
    height: 40,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  focusedInput: {
    borderColor: "#007aff",
  },
  cancelButton: {
    marginLeft: 10,
  },
  cancelButtonText: {
    color: "#007aff",
    fontSize: 16,
  },
});
