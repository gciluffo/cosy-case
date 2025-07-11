import { Book } from "@/models/book";
import useStore from "@/store";
import { useMemo } from "react";
import { BarChart } from "react-native-gifted-charts";

export default function State() {
  const { cases, user, updateUser } = useStore();

  const allBooks = useMemo(() => {
    const books = cases.reduce((acc, bookCase) => {
      return [...acc, ...bookCase.books];
    }, [] as Book[]);
    const uniqueBooks = books.filter(
      (book, index, self) => self.findIndex((b) => b.key === book.key) === index
    );

    return uniqueBooks;
  }, [cases]);

  return null;
}
