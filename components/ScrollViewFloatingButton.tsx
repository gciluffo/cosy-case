import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import React, { useEffect } from "react";
import { isTablet } from "@/utils/scale";

interface Props {
  children: React.ReactNode;
  onPress: () => void;
  buttonText: string;
  disabled?: boolean;
}

const ScollViewFloatingButton = React.memo((props: Props) => {
  const [isKeyboardVisible, setIsKeyboardVisible] = React.useState(false);
  const { children, onPress, buttonText, disabled } = props;
  let screenHeight = Dimensions.get("window").height;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <View style={{ height: screenHeight, padding: 20 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? -20 : 20}
        style={{ flex: 1 }}
      >
        <ScrollView keyboardShouldPersistTaps="handled">{children}</ScrollView>
        <View
          style={[
            styles.buttonContainer,
            { height: screenHeight * (isTablet ? 0.1 : 0.21) },
          ]}
        >
          {isKeyboardVisible ? (
            <Button size="xl" style={styles.keyboardButton} onPress={onPress}>
              <ButtonText>Finish</ButtonText>
            </Button>
          ) : (
            <Button
              size="xl"
              style={styles.button}
              onPress={onPress}
              disabled={disabled}
              className={disabled ? "bg-background-disabled" : undefined}
            >
              <ButtonText>{buttonText}</ButtonText>
            </Button>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
});

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryContainer: {},
  ingredientChipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  button: {
    margin: 10,
    width: "95%",
    borderRadius: 10,
  },
  keyboardButton: {
    margin: 10,
    alignSelf: "flex-end",
    borderRadius: 10,
  },
});

export default ScollViewFloatingButton;
