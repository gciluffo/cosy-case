import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Book, BookCase, BookReview } from "@/models/book";
import { middleware } from "zustand-expo-devtools";

// Books have to be added to cases
//

export interface User {
  deviceId: string;
  isOnboarded: boolean;
  bookListDisplayMode?: "grid" | "list";
  bookListFilter?: BookReview;
}

export interface Store {
  user: User;
  cases: BookCase[];
  addBooksToCase: (caseName: string, books: Book[]) => void;
  updateBook: (bookId: string, book: Partial<Book>) => void;
  removeBookFromCase: (bookId: string, caseName: string) => void;
  addCase: (bookCase: BookCase) => void;
  removeCase: (caseName: string) => void;
  updateCase: (caseName: string, bookCase: Partial<BookCase>) => void;
  getCaseByName: (caseName: string) => BookCase | undefined;
  removeBook: (bookId: string) => void;
  getBookByKey: (key: string) => Book | undefined;
  setUser: (user: User) => void;
  updateUser: (user: Partial<User>) => void;
}

const useStore = create<Store, [["zustand/persist", unknown]]>(
  persist(
    (set, get) => ({
      user: {
        deviceId: "",
        isOnboarded: false,
        bookListDisplayMode: "grid",
        bookListFilter: undefined,
      },
      books: [],
      cases: [
        {
          name: "default",
          topImageKey: "birchTop",
          middleImageKey: "birchMiddle",
          bottomImageKey: "birchBottom",
          offsetXPercent: 0.07,
          offsetYPercent: 0.07,
          books: [],
          isDefault: true,
          widgets: [],
        },
      ],
      addCase: (bookCase: BookCase) =>
        set((state) => ({ cases: [...state.cases, bookCase] })),
      removeCase: (caseName: string) =>
        set((state) => ({
          cases: state.cases.filter((bookCase) => bookCase.name !== caseName),
        })),
      updateCase: (caseName: string, bookCase: Partial<BookCase>) =>
        set((state) => {
          return {
            cases: state.cases.map((c) =>
              c.name === caseName ? { ...c, ...bookCase } : c
            ),
          };
        }),
      getCaseByName: (caseName: string) =>
        get().cases.find((bookCase) => bookCase.name === caseName),
      addBooksToCase: (caseName: string, books: Book[]) =>
        set((state) => ({
          cases: state.cases.map((bookCase) => {
            return bookCase.name === caseName
              ? {
                  ...bookCase,
                  books: [...bookCase.books, ...books],
                }
              : bookCase;
          }),
        })),
      removeBookFromCase: (bookId: string, caseName: string) =>
        set((state) => ({
          cases: state.cases.map((bookCase) =>
            bookCase.name === caseName
              ? {
                  ...bookCase,
                  books: bookCase.books.filter((b) => b.key !== bookId),
                }
              : bookCase
          ),
        })),
      getBookByKey: (key: string) => {
        const { cases } = get();
        for (const bookCase of cases) {
          const { books } = bookCase;
          const foundBook = books.find((b) => b.key === key);
          if (foundBook) return foundBook;
        }
      },
      removeBook: (bookId: string) => {
        const { cases } = get();
        const newCases = cases.map((bookCase) => ({
          ...bookCase,
          books: bookCase.books.filter((b) => b.key !== bookId),
        }));
        set({ cases: newCases });
      },
      setUser: (user: User) => set({ user }),
      updateUser: (user: Partial<User>) =>
        set((state) => ({ user: { ...state.user, ...user } })),
      updateBook: (bookId: string, book: Partial<Book>) =>
        set((state) => ({
          cases: state.cases.map((bookCase) => ({
            ...bookCase,
            books: bookCase.books.map((b) =>
              b.key === bookId ? { ...b, ...book } : b
            ),
          })),
        })),
    }),
    {
      name: "user", // Storage key
      storage: createJSONStorage(() => AsyncStorage), // Use AsyncStorage for persistence
    }
  )
);

middleware(useStore, "store");

export default useStore;
