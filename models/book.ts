import { OpenLibraryBook, OpenLibraryBookSearch } from "./open-library";

export type Spine = {
  cacheKey: string;
  selected: boolean;
  originalImageWidth: number;
  originalImageHeight: number;
};

export enum BookStatus {
  READING = "reading",
  TBR = "tbr",
  FINISHED = "finished",
}

export enum BookReview {
  BAD = "bad",
  OKAY = "okay",
  GOOD = "good",
}

export type Book = OpenLibraryBook & {
  cover_urls?: string[];
  spines: Spine[];
  status: BookStatus;
  review: BookReview;
  colors: {
    primary: string;
    secondary: string;
  };
};

export interface BookCase {
  name: string;
  topImageKey: string;
  middleImageKey: string;
  bottomImageKey: string;
  offsetXPercent: number;
  offsetYPercent: number;
  isSelected: boolean;
  books: Book[];
  isDefault: boolean;
  widgets?: {
    uri: string;
  }[];
}
