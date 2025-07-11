import { CameraView, useCameraPermissions } from "expo-camera";
import { useState, useRef, useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Text } from "@/components/ui/text";
import { confirmCroppedImage, uploadImageForSpineDetection } from "@/api";
import CroppedImageConfirm from "@/components/ImageEditor";
import { getObjectKeyFromSignedUrl } from "@/utils/image";

interface Params {
  key: string;
  title: string;
  author_name: string[];
  author: string;
}

export default function ScanSpine() {
  const [permission, requestPermission] = useCameraPermissions();
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const params = useLocalSearchParams();
  const { book } = params;
  const bookParsed: Params = JSON.parse(book as string);

  // if (!permission) {
  //   return <View />;
  // }

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stopRecording();
      }
    };
  }, []);

  const takeAndUploadPhoto = async () => {
    if (!cameraRef.current) return;

    try {
      // Take the picture
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false, // base64 not needed for file upload
        skipProcessing: true,
      });

      setUploading(true);

      // TODO: Have a better imrpvoed yolo model for this.
      // The issue is that it does not crop well when the image is sideways.

      if (!photo?.uri) {
        console.error("No photo URI");
        return;
      }

      const file = {
        uri: photo.uri,
        name: photo.uri.split("/").pop(), // Extract the file name
        type: "image/jpeg", // Adjust the MIME type if necessary
      };

      const res = await uploadImageForSpineDetection(
        file,
        bookParsed.key,
        bookParsed.title,
        bookParsed?.author_name?.join(", ") || bookParsed?.author
      );

      console.log("Upload result:", res);
      const signedUrl = res.signed_urls[0];
      setImage(signedUrl);
    } catch (error) {
      console.log("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const onImageConfirm = async (confirm: boolean) => {
    const { objectKey } = getObjectKeyFromSignedUrl(image!);
    const res = await confirmCroppedImage(confirm, objectKey, bookParsed.key);

    if (confirm) {
      router.back();
      router.setParams({
        refetchSpineImages: "true",
      });
    }
  };

  // show view if the permissions were denied and cant ask again
  // add button to open settings for app
  if (permission?.canAskAgain === false && !permission?.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text size="lg" style={styles.message}>
          Camera permissions were denied. Please enable them in the settings
          app.
        </Text>
      </View>
    );
  }

  if (uploading) {
    return (
      <View style={styles.permissionContainer}>
        <ActivityIndicator size="large" />
        <Text size="lg" style={styles.message}>
          Cropping spine...
        </Text>
      </View>
    );
  }

  if (image) {
    return (
      <CroppedImageConfirm
        image={image}
        onCancel={() => {
          setImage(null);
          onImageConfirm(false);
        }}
        onConfirm={() => onImageConfirm(true)}
      />
    );
  }

  return (
    <>
      {permission?.granted ? (
        <View style={styles.container}>
          <CameraView
            style={styles.camera}
            facing={"back"}
            ref={cameraRef}
            mode="picture"
          >
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={takeAndUploadPhoto}
              />
            </View>
          </CameraView>
        </View>
      ) : (
        <View />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
    width: "70%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 70,
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    borderWidth: 5,
    borderColor: "gray",
  },
  resultsContainer: {
    padding: 20,
    alignItems: "center",
  },
  croppedImage: {
    width: 500,
    height: 450,
    marginVertical: 10,
    borderRadius: 10,
  },
});
