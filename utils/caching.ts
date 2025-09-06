import { CacheManager } from "@/components/ChachedImage";
import { captureRef } from "react-native-view-shot";

const PLACEHOLDER_STRING = "-spine-placeholder";
const INVERTED_PLACEHOLDER_STRING = "-spine-placeholder-inverted";

export const getPlaceholderSpineCacheKey = (bookKey: string) => {
  return `${bookKey}${PLACEHOLDER_STRING}`;
};

export const getInvertedPlaceholderSpineCacheKey = (bookKey: string) => {
  return `${bookKey}${INVERTED_PLACEHOLDER_STRING}`;
};

export const getRemoteSpineCacheKey = (bookKey: string) => {
  return `${bookKey}-spine-${new Date().getTime()}`;
};

export const isCacheKeyPlaceholderSpine = (key: string) => {
  return key.includes(PLACEHOLDER_STRING);
};

export const downloadPlaceholderSpine = async (
  spineRef: React.MutableRefObject<null>,
  cacheKey: string
) => {
  const uri = await captureRef(spineRef, {
    width: 50,
    height: 250,
    quality: 1,
  });

  if (uri) {
    await CacheManager.downloadAsync({
      uri: uri,
      key: cacheKey,
      options: {},
    });
  }
};
