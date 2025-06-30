import { BookReview } from "@/models/book";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";

export default function BookReviewIcon({
  bookReview,
  size = 20,
}: {
  bookReview: BookReview;
  size?: number;
}) {
  if (bookReview === BookReview.DISLIKED) {
    return (
      <Image
        source={require("@/assets/images/disliked.png")}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    );
  }

  if (bookReview === BookReview.LOVED) {
    return (
      <Image
        source={require("@/assets/images/loved.png")}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    );
  }

  if (bookReview === BookReview.LIKED) {
    return (
      <Image
        source={require("@/assets/images/liked.png")}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    );
  }

  return null;
}
