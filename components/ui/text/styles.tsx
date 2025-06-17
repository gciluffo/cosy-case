import { tva } from "@gluestack-ui/nativewind-utils/tva";
import { isWeb } from "@gluestack-ui/nativewind-utils/IsWeb";
import { moderateScale } from "@/utils/scale";

const baseStyle = isWeb
  ? "font-sans tracking-sm my-0 bg-transparent border-0 box-border display-inline list-none margin-0 padding-0 position-relative text-start no-underline whitespace-pre-wrap word-wrap-break-word"
  : "";

export const textStyle = tva({
  base: `text-typography-700 font-body ${baseStyle}`,

  variants: {
    isTruncated: {
      true: "web:truncate",
    },
    bold: {
      true: "font-bold",
    },
    underline: {
      true: "underline",
    },
    strikeThrough: {
      true: "line-through",
    },
    // size: {
    //   "2xs": { fontSize: moderateScale(10) }, // Adjust based on Tailwind
    //   xs: { fontSize: moderateScale(12) },
    //   sm: { fontSize: moderateScale(14) },
    //   md: { fontSize: moderateScale(16) },
    //   lg: { fontSize: moderateScale(18) },
    //   xl: { fontSize: moderateScale(20) },
    //   "2xl": { fontSize: moderateScale(24) },
    //   "3xl": { fontSize: moderateScale(30) },
    //   "4xl": { fontSize: moderateScale(36) },
    //   "5xl": { fontSize: moderateScale(48) },
    //   "6xl": { fontSize: moderateScale(60) },
    // },
    size: {
      "2xs": "text-2xs",
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
      "5xl": "text-5xl",
      "6xl": "text-6xl",
    },
    sub: {
      true: "text-xs",
    },
    italic: {
      true: "italic",
    },
    highlight: {
      true: "bg-yellow-500",
    },
  },
});
