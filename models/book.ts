import { OpenLibraryBook, OpenLibraryBookSearch } from "./external";

export type Spine = {
  cacheKey: string;
  selected: boolean;
  originalImageWidth?: number;
  originalImageHeight?: number;
};

export enum BookStatus {
  READING = "reading",
  WANT_TO_READ = "want-to-read",
  READ = "read",
}

export enum BookReview {
  BAD = "bad",
  OKAY = "okay",
  GOOD = "good",
}

export type Book = OpenLibraryBook &
  OpenLibraryBookSearch & {
    spines: Spine[];
    status: BookStatus;
    review: BookReview;
    colors: {
      primary: string;
      secondary: string;
    };
  };
