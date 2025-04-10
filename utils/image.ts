import ImageColors from "react-native-image-colors";
import { IOSImageColors } from "react-native-image-colors/build/types";

export async function getPrimaryAndSecondaryColors(
  imageUrl: string
): Promise<{ primary: string; secondary: string }> {
  const result = await ImageColors.getColors(imageUrl, {
    fallback: "#CCCCCC",
  });

  console.log("Image colors result:", result);

  if (result.platform === "android") {
    return {
      primary: result.dominant || "#CCCCCC",
      secondary: result.average || "#CCCCCC",
    };
  } else {
    const iosResult = result as IOSImageColors;
    return {
      primary: iosResult.primary || "#CCCCCC",
      secondary: iosResult.secondary || "#CCCCCC",
    };
  }
}
