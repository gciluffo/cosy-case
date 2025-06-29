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
  DISLIKED = "disliked",
  LIKED = "liked",
  LOVED = "loved",
}

export type Book = OpenLibraryBook & {
  cover_urls?: string[];
  spines: Spine[];
  status: BookStatus;
  review: BookReview;
  reviewText?: string;
  colors: {
    primary: string;
    secondary: string;
  };
  dateAdded: string;
};

export interface Widget {
  id?: string;
  cacheKey: string;
}

export interface Wallpaper {
  id?: string;
  cacheKey?: string;
  url?: string;
}

export interface BookCase {
  name: string;
  topImageKey: string;
  middleImageKey: string;
  bottomImageKey: string;
  offsetXPercent: number;
  offsetYPercent: number;
  books: Book[];
  isDefault: boolean;
  widgets: Widget[];
  wallPaper?: Wallpaper;
  sortOrder?: BookSortOrder;
}

export const isBook = (item: Book | Widget): item is Book => {
  return (item as Book).spines !== undefined;
};

export enum BookSortOrder {
  DATE_ADDED = "date_added",
  TITLE = "title",
  AUTHOR = "author",
  GENRE = "genre",
  COLOR = "color",
}
