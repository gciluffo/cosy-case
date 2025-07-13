import { OpenLibraryBook, OpenLibraryBookSearch } from "./open-library";

export type Spine = {
  cacheKey: string;
  selected: boolean;
  originalImageWidth: number;
  originalImageHeight: number;
  colors?: {
    primary: string;
    secondary: string;
  };
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
  categories?: string[]; // this is from google books, can be used for getting genre information
  genericGenre?: GenericBookGenre; // this is the calculated genre based on categories
  dateAdded: string;
  dateFinished?: string;
  dateStarted?: string;
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

export enum GenericBookGenre {
  // Fiction = "Fiction",
  NonFiction = "Non-Fiction",
  Fantasy = "Fantasy",
  ScienceFiction = "Science Fiction",
  Mystery = "Mystery",
  Romance = "Romance",
  Thriller = "Thriller",
  Historical = "Historical",
  Horror = "Horror",
  Poetry = "Poetry",
  Drama = "Drama",
  YoungAdult = "Young Adult",
  Childrens = "Children's",
  Biography = "Biography",
  SelfHelp = "Self-help",
  HealthWellness = "Health & Wellness",
  Science = "Science",
  Mathematics = "Mathematics",
  History = "History",
  ArtDesign = "Art & Design",
  Business = "Business",
  Politics = "Politics",
  Religion = "Religion",
  Psychology = "Psychology",
  Education = "Education",
  TravelPlaces = "Travel & Places",
  AnimalsNature = "Animals & Nature",
  Cookbooks = "Cookbooks",
  ComicsGraphicNovels = "Comics & Graphic Novels",
  Textbooks = "Textbooks",
  ProgrammingTech = "Programming & Tech",
}
