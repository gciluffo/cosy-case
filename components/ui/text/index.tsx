import React from "react";
import type { VariantProps } from "@gluestack-ui/nativewind-utils";
import { Text as RNText, TextProps } from "react-native";
import { textStyle } from "./styles";
import { moderateScale } from "@/utils/scale";

type ITextProps = TextProps & VariantProps<typeof textStyle>;

const fontSizeMap = {
  "2xs": moderateScale(8, 0.2),
  xs: moderateScale(10, 0.2),
  sm: moderateScale(14, 0.2),
  md: moderateScale(16, 0.2),
  lg: moderateScale(18, 0.2),
  xl: moderateScale(20, 0.2),
  "2xl": moderateScale(24, 0.2),
  "3xl": moderateScale(30, 0.2),
  "4xl": moderateScale(36, 0.2),
  "5xl": moderateScale(48, 0.2),
  "6xl": moderateScale(60, 0.2),
};

const Text = React.forwardRef<React.ElementRef<typeof RNText>, ITextProps>(
  (
    {
      className,
      isTruncated,
      bold,
      underline,
      strikeThrough,
      size = "md",
      sub,
      italic,
      highlight,
      style,
      ...props
    },
    ref
  ) => {
    return (
      <RNText
        ref={ref}
        className={textStyle({
          isTruncated,
          bold,
          underline,
          strikeThrough,
          size,
          sub,
          italic,
          highlight,
          class: className,
        })}
        style={[style, { fontSize: fontSizeMap[size] }]}
        {...props}
      />
    );
  }
);

Text.displayName = "Text";
export { Text };
