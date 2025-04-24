import { Book } from "@/models/book";
import CachedImage from "./ChachedImage";

interface BookSpineProps {
  book: Book & { width: number; height: number };
}

const BookSpine = (props: BookSpineProps) => {
  const { book } = props;
  const { width, height } = book;
  const spine = book.spines.find((s) => s.selected);

  //   if (book.title.toLowerCase() === "the way of kings") {
  console.log("BookSpine", book.title, spine, width, height);
  //   }

  if (!spine?.cacheKey) {
    return null;
  }

  return (
    <CachedImage
      source={{
        uri: "",
      }}
      cacheKey={spine.cacheKey}
      style={{
        width: width,
        height: height,
        borderRadius: 1,
      }}
    />
  );
};

export default BookSpine;
