import { OpenLibraryBook, OpenLibraryBookSearch } from "./external";

export type Spine = {
  cacheKey: string;
  selected: boolean;
};

export type Book = OpenLibraryBook &
  OpenLibraryBookSearch & {
    spines: Spine[];
  };
