import * as Haptics from "expo-haptics";
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  BarcodeScanningResult,
} from "expo-camera";
import { useState, useRef, useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Text } from "@/components/ui/text";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Heading } from "@/components/ui/heading";
import FontAwesome from "@expo/vector-icons/build/FontAwesome";
import { searchBooks } from "@/api";
import { OpenLibraryBookSearch } from "@/models/open-library";
import BookSearchResult from "@/components/BookSearchResult";
import useStore from "@/store";

export default function AddBookScan() {
  const [scanned, setScanned] = useState(false);
  const [scannedBooks, setScannedBooks] = useState<OpenLibraryBookSearch[]>([]);
  const [permission, requestPermission] = useCameraPermissions();
  const [currentIsbn, setCurrentIsbn] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const { cases } = useStore();

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

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!currentIsbn) {
        return;
      }
      console.log("calling onBarcodeScanned from useEffect", currentIsbn);
      onBarcodeScanned(currentIsbn);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [currentIsbn]);

  const onBarcodeScanned = async (isbn: string) => {
    try {
      // if book already scanned, return
      if (!isbn) {
        return;
      }
      setScanned(true);

      if (scanned || scannedBooks.some((b) => b.isbn === isbn)) {
        console.log("Book already scanned");
        return;
      }

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const results = await searchBooks(isbn);
      const firstResult = results[0];
      if (!firstResult) {
        return;
      }

      // push to book to scanned books
      if (!scannedBooks.some((b) => b.isbn === firstResult.isbn)) {
        setScannedBooks((prev) => {
          const newScannedBooks = [...prev, { ...firstResult, isbn }];
          return newScannedBooks;
        });
      }
    } catch (error) {
      console.error("Error scanning barcode:", error);
    } finally {
      setScanned(false);
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

  const onAddToLibrary = (book: OpenLibraryBookSearch) => {
    router.push({
      pathname: "/add-book",
      params: {
        book: JSON.stringify({
          key: book.key,
          edition: book.editions.docs[0].key,
          title: book.title,
          author: book.author_name?.join(", ") || "",
          cover_url: book.cover_url,
        }),
      },
    });
  };

  const isBookAlreadyInLibrary = (book: OpenLibraryBookSearch) => {
    const formattedKey = book.key.split("/").pop();
    return cases.some((c) => c.books.some((b) => b.key === formattedKey));
  };

  return (
    <>
      {permission?.granted ? (
        <ParallaxScrollView
          parallaxHeaderHeight={300}
          parallaxHeaderContent={() => (
            <View style={styles.container}>
              <CameraView
                style={styles.camera}
                facing={"back"}
                ref={cameraRef}
                mode="picture"
                barcodeScannerSettings={{
                  barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e"],
                }}
                onBarcodeScanned={(barcode) => {
                  setCurrentIsbn(barcode.data);
                }}
              >
                <View style={styles.outline}></View>
              </CameraView>
            </View>
          )}
        >
          <View style={styles.listContainer}>
            <View style={styles.pulldownPill}></View>
            <View className="h-5" />
            <Heading>Scanned books {scannedBooks.length}</Heading>
            <View className="h-5" />
            {scannedBooks.length > 0 ? (
              <View>
                {scannedBooks.map((b) => (
                  <BookSearchResult
                    title={b.title}
                    imageUrl={b.cover_url}
                    author={b.author_name?.[0]}
                    onAddToLibrary={() => onAddToLibrary(b)}
                    isBookAlreadyInLibrary={isBookAlreadyInLibrary(b)}
                  />
                ))}
              </View>
            ) : (
              <View className="flex-row gap-10 items-center">
                <FontAwesome name="barcode" size={32} color="black" />
                <View className="flex-1">
                  <Text size="xl" bold>
                    Scan one or mutliple barcodes
                  </Text>
                  <Text>Scan one or mutliple barcodes</Text>
                </View>
              </View>
            )}
          </View>
        </ParallaxScrollView>
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
    height: 650,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  outline: {
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 10,
    width: "60%",
    height: "20%",
    position: "absolute",
    top: "40%",
    left: "20%",
    bottom: "20%",
    right: "20%",
  },
  pulldownPill: {
    height: 5,
    width: 40,
    backgroundColor: "grey",
    borderRadius: 10,
    alignSelf: "center",
  },
  listContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -60,
    backgroundColor: "white",
    padding: 20,
    height: "100%",
  },
});
