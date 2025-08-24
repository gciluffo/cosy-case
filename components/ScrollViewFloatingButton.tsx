import { View, ScrollView, StyleSheet, Dimensions } from "react-native";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import React, { useEffect } from "react";
import { isTablet } from "@/utils/scale";

interface Props {
  children: React.ReactNode;
  onPress: () => void;
  buttonText: string;
  disabled?: boolean;
  loading?: boolean;
}

const ScrollViewFloatingButton = React.memo((props: Props) => {
  const { children, onPress, buttonText, disabled, loading } = props;
  let screenHeight = Dimensions.get("window").height;

  return (
    <View style={{ height: screenHeight, padding: 20 }}>
      <ScrollView keyboardShouldPersistTaps="handled">{children}</ScrollView>
      <View
        style={[
          styles.buttonContainer,
          { height: screenHeight * (isTablet ? 0.1 : 0.21) },
        ]}
      >
        <Button
          size="xl"
          style={styles.button}
          onPress={onPress}
          disabled={disabled || loading}
          className={disabled || loading ? "bg-gray-300" : undefined}
        >
          {loading ? (
            <>
              <ButtonSpinner />
            </>
          ) : (
            <ButtonText>{buttonText}</ButtonText>
          )}
        </Button>
      </View>
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
    height: 50,
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

export default ScrollViewFloatingButton;
