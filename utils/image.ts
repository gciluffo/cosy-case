import ImageColors from "react-native-image-colors";
import { IOSImageColors } from "react-native-image-colors/build/types";

export async function getPrimaryAndSecondaryColors(
  imageUrl: string
): Promise<{ primary: string; secondary: string }> {
  const result = await ImageColors.getColors(imageUrl, {
    fallback: "#CCCCCC",
  });

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

export function getWidthHeightFromUrl(signedUrl: string): {
  width: number;
  height: number;
} {
  const url = new URL(signedUrl);
  const pathParts = url.pathname.split("/");
  // filename = f"book_spine_{datetime.now().strftime('%Y%m%d_%H%M%S')}_w{image_width}_h{image_height}.jpg"
  const fileName = pathParts[pathParts.length - 1];

  const widthMatch = fileName.match(/_w(\d+)/);
  const heightMatch = fileName.match(/_h(\d+)/);
  const width = widthMatch ? parseInt(widthMatch[1], 10) : 0;
  const height = heightMatch ? parseInt(heightMatch[1], 10) : 0;
  return { width, height };
}

export function getObjectKeyFromSignedUrl(signedUrl: string): {
  objectKey: string;
  bucketName: string;
} {
  const url = new URL(signedUrl);
  const pathParts = url.pathname.split("/");
  const objectKey = pathParts.slice(2).join("/");
  const bucketName = pathParts[1];
  return { objectKey, bucketName };
}

// Idk why google returns http links for images
export const convertToHttps = (url: string) => {
  if (url.startsWith("http://")) {
    return url.replace("http://", "https://");
  }
  return url;
};
