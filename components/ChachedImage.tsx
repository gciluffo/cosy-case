import { SkImage } from "@shopify/react-native-skia";
import * as FileSystem from "expo-file-system";
import { DownloadOptions } from "expo-file-system/src/FileSystem.types";
import React, { useEffect, useRef, useState } from "react";
import { Image, ImageProps } from "expo-image";

export const IMAGE_CACHE_FOLDER = `${FileSystem.cacheDirectory}`;

export const sanitizeCacheKey = (key: string): string => {
  // Remove any potentially unsafe characters
  // Allow only alphanumeric characters, dashes, and underscores
  return (
    key
      .replace(/[^a-zA-Z0-9-_]/g, "_")
      // Ensure the key doesn't start with a dash or period
      .replace(/^[-.]/, "_")
      // Limit the length to prevent extremely long filenames
      .slice(0, 100)
  );
};

type CachedImageProps = Omit<ImageProps, "source"> & {
  cacheKey: string;
  source: { uri: string; expiresIn?: number };
  placeholderContent?: React.ReactNode;
};

const CachedImage: React.FC<CachedImageProps> = (props) => {
  const { source, cacheKey, placeholderContent, ...rest } = props;
  const { uri, expiresIn } = source;
  const sanitizedKey = sanitizeCacheKey(cacheKey);
  const fileURI = `${IMAGE_CACHE_FOLDER}${sanitizedKey}.png`;

  const [imgUri, setImgUri] = useState<string | null>(fileURI);

  const componentIsMounted = useRef(false);

  useEffect(() => {
    componentIsMounted.current = true;
    void loadImageAsync();
    return () => {
      componentIsMounted.current = false;
    };
  }, [cacheKey]);

  const loadImageAsync = async () => {
    try {
      const metadata = await FileSystem.getInfoAsync(fileURI);
      const expired = Boolean(
        metadata?.exists &&
          expiresIn &&
          new Date().getTime() / 1000 - metadata.modificationTime > expiresIn
      );

      await setImgUri(null);
      if (componentIsMounted.current) {
        // if (expired) {
        //   await FileSystem.deleteAsync(fileURI, { idempotent: true });
        // }

        if (metadata?.exists) {
          const contentUri = await FileSystem.getContentUriAsync(fileURI);
          setImgUri(contentUri);
          return;
        }

        const response = await FileSystem.downloadAsync(uri, fileURI);
        if (componentIsMounted.current && response?.status === 200) {
          setImgUri(`${fileURI}`);
        }
        if (response?.status !== 200) {
          FileSystem.deleteAsync(fileURI, { idempotent: true });
        }
      }
    } catch (err) {
      console.error("Error loading image:", err);
      setImgUri(uri);
    }
  };

  if (!imgUri) return placeholderContent || null;

  return (
    <Image
      {...rest}
      contentFit="contain"
      source={{
        ...source,
        uri: imgUri,
      }}
    />
  );
};

export const CacheManager = {
  addToCache: async ({ file, key }: { file: string; key: string }) => {
    const sanitizedKey = sanitizeCacheKey(key);
    await FileSystem.copyAsync({
      from: file,
      to: `${IMAGE_CACHE_FOLDER}${sanitizedKey}.png`,
    });
    return await CacheManager.getCachedUri({ key });
  },

  getCachedUri: async ({ key }: { key: string }) => {
    const sanitizedKey = sanitizeCacheKey(key);
    return await FileSystem.getContentUriAsync(
      `${IMAGE_CACHE_FOLDER}${sanitizedKey}.png`
    );
  },

  downloadAsync: async ({
    uri,
    key,
    options,
  }: {
    uri: string;
    key: string;
    options: DownloadOptions;
  }) => {
    const sanitizedKey = sanitizeCacheKey(key);
    return await FileSystem.downloadAsync(
      uri,
      `${IMAGE_CACHE_FOLDER}${sanitizedKey}.png`,
      options
    );
  },
  saveBytesToCache: async ({ image, key }: { image: SkImage; key: string }) => {
    const sanitizedKey = sanitizeCacheKey(key);
    const filePath = `${IMAGE_CACHE_FOLDER}${sanitizedKey}.png`;

    try {
      // Write the bytes to the file system
      await FileSystem.writeAsStringAsync(filePath, image.encodeToBase64(), {
        encoding: FileSystem.EncodingType.Base64,
      });
      return filePath; // Return the cached file path
    } catch (error) {
      console.error("Error saving bytes to cache:", error);
      throw error;
    }
  },
  removeFromCache: async ({ key }: { key: string }) => {
    const sanitizedKey = sanitizeCacheKey(key);
    try {
      await FileSystem.deleteAsync(`${IMAGE_CACHE_FOLDER}${sanitizedKey}.png`, {
        idempotent: true,
      });
    } catch (error) {
      console.error("Error removing from cache:", error);
    }
  },
  checkIfCached: async ({ key }: { key: string }) => {
    const sanitizedKey = sanitizeCacheKey(key);
    const fileURI = `${IMAGE_CACHE_FOLDER}${sanitizedKey}.png`;
    const metadata = await FileSystem.getInfoAsync(fileURI);
    return metadata.exists;
  },
};

export default CachedImage;
