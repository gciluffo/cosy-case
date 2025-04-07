import ImageColors from "react-native-image-colors";
import { IOSImageColors } from "react-native-image-colors/build/types";

export async function getPrimaryColor(imageUrl: string): Promise<string> {
  const result = await ImageColors.getColors(imageUrl, {
    fallback: "#CCCCCC",
  });

  console.log("Image colors result:", result);

  return result.platform === "android"
    ? result.dominant
    : (result as IOSImageColors).primary;
}
