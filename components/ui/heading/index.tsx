import React, { forwardRef, memo } from "react";
import { H1, H2, H3, H4, H5, H6 } from "@expo/html-elements";
import { headingStyle } from "./styles";
import type { VariantProps } from "@gluestack-ui/nativewind-utils";
import { cssInterop } from "nativewind";
import { moderateScale } from "@/utils/scale";

type IHeadingProps = VariantProps<typeof headingStyle> &
  React.ComponentPropsWithoutRef<typeof H1> & {
    as?: React.ElementType;
  };

cssInterop(H1, { className: "style" });
cssInterop(H2, { className: "style" });
cssInterop(H3, { className: "style" });
cssInterop(H4, { className: "style" });
cssInterop(H5, { className: "style" });
cssInterop(H6, { className: "style" });

const fontSizeMap = {
  "2xs": moderateScale(12, 0.1),
  xs: moderateScale(12, 0.1),
  sm: moderateScale(14, 0.1),
  md: moderateScale(16, 0.1),
  lg: moderateScale(18, 0.1),
  xl: moderateScale(20, 0.1),
  "2xl": moderateScale(24, 0.1),
  "3xl": moderateScale(32, 0.1),
  "4xl": moderateScale(38, 0.1),
  "5xl": moderateScale(50, 0.1),
  "6xl": moderateScale(62, 0.1),
};

const MappedHeading = memo(
  forwardRef<React.ElementRef<typeof H1>, IHeadingProps>(
    (
      {
        size,
        className,
        isTruncated,
        bold,
        underline,
        strikeThrough,
        sub,
        italic,
        highlight,
        style,
        ...props
      },
      ref
    ) => {
      switch (size) {
        case "5xl":
        case "4xl":
        case "3xl":
          return (
            <H1
              className={headingStyle({
                size,
                isTruncated,
                bold,
                underline,
                strikeThrough,
                sub,
                italic,
                highlight,
                class: className,
              })}
              style={[style, { fontSize: fontSizeMap[size] }]}
              {...props}
              // @ts-expect-error
              ref={ref}
            />
          );
        case "2xl":
          return (
            <H2
              className={headingStyle({
                size,
                isTruncated,
                bold,
                underline,
                strikeThrough,
                sub,
                italic,
                highlight,
                class: className,
              })}
              style={[style, { fontSize: fontSizeMap[size] }]}
              {...props}
              // @ts-expect-error
              ref={ref}
            />
          );
        case "xl":
          return (
            <H3
              className={headingStyle({
                size,
                isTruncated,
                bold,
                underline,
                strikeThrough,
                sub,
                italic,
                highlight,
                class: className,
              })}
              style={[style, { fontSize: fontSizeMap[size] }]}
              {...props}
              // @ts-expect-error
              ref={ref}
            />
          );
        case "lg":
          return (
            <H4
              className={headingStyle({
                size,
                isTruncated,
                bold,
                underline,
                strikeThrough,
                sub,
                italic,
                highlight,
                class: className,
              })}
              style={[style, { fontSize: fontSizeMap[size] }]}
              {...props}
              // @ts-expect-error
              ref={ref}
            />
          );
        case "md":
          return (
            <H5
              className={headingStyle({
                size,
                isTruncated,
                bold,
                underline,
                strikeThrough,
                sub,
                italic,
                highlight,
                class: className,
              })}
              style={[style, { fontSize: fontSizeMap[size] }]}
              {...props}
              // @ts-expect-error
              ref={ref}
            />
          );
        case "sm":
        case "xs":
          return (
            <H6
              className={headingStyle({
                size,
                isTruncated,
                bold,
                underline,
                strikeThrough,
                sub,
                italic,
                highlight,
                class: className,
              })}
              style={[style, { fontSize: fontSizeMap[size] }]}
              {...props}
              // @ts-expect-error
              ref={ref}
            />
          );
        default:
          return (
            <H4
              className={headingStyle({
                size,
                isTruncated,
                bold,
                underline,
                strikeThrough,
                sub,
                italic,
                highlight,
                class: className,
              })}
              style={[style, { fontSize: fontSizeMap["lg"] }]}
              {...props}
              // @ts-expect-error
              ref={ref}
            />
          );
      }
    }
  )
);

const Heading = memo(
  forwardRef<React.ElementRef<typeof H1>, IHeadingProps>(
    ({ className, size = "lg", as: AsComp, ...props }, ref) => {
      const {
        isTruncated,
        bold,
        underline,
        strikeThrough,
        sub,
        italic,
        highlight,
      } = props;

      if (AsComp) {
        return (
          <AsComp
            className={headingStyle({
              size,
              isTruncated,
              bold,
              underline,
              strikeThrough,
              sub,
              italic,
              highlight,
              class: className,
            })}
            {...props}
          />
        );
      }

      return (
        <MappedHeading className={className} size={size} ref={ref} {...props} />
      );
    }
  )
);

Heading.displayName = "Heading";

export { Heading };
