import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Book } from "@/models/book";

export interface User {
  deviceId: string;
  isOnboarded: boolean;
}

export interface Store {
  user: User;
  books: Book[];
  addBook: (book: Book) => void;
  removeBook: (bookId: string) => void;
  updateBook: (bookId: string, book: Partial<Book>) => void;
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
      },
      books: [],
      getBookByKey: (key: string) => {
        const { books } = get();
        return books.find((book) => book.key === key);
      },
      addBook: (book: Book) =>
        set((state) => ({ books: [...state.books, book] })),
      removeBook: (bookId: string) =>
        set((state) => ({
          books: state.books.filter((book) => book.key !== bookId),
        })),

      updateBook: (bookId: string, book: Partial<Book>) =>
        set((state) => ({
          books: state.books.map((b) =>
            b.key === bookId ? { ...b, ...book } : b
          ),
        })),
      setUser: (user: User) => set({ user }),
      updateUser: (user: Partial<User>) =>
        set((state) => ({ user: { ...state.user, ...user } })),
    }),
    {
      name: "user", // Storage key
      storage: createJSONStorage(() => AsyncStorage), // Use AsyncStorage for persistence
    }
  )
);

export default useStore;
