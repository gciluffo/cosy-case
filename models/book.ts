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

export enum BadgeType {
  FIRST_FINISHED_BOOK = "first_finished_book",
  FIRST_SHARED_BOOK = "first_shared_book",
  FIVE_SCIFI_BOOKS_FINISHED = "five_scifi_books_finished",
  FIVE_FANTASY_BOOKS_FINISHED = "five_fantasy_books_finished",
  FIVE_NON_FICTION_BOOKS_FINISHED = "five_non_fiction_books_finished",
  FIVE_ROMANCE_BOOKS_FINISHED = "five_romance_books_finished",
  FIVE_MYSTERY_BOOKS_FINISHED = "five_mystery_books_finished",
  FIVE_HORROR_BOOKS_FINISHED = "five_horror_books_finished",
  // FIVE_THRILLER_BOOKS_FINISHED = "five_thriller_books_finished",
  FIFTEY_BOOKS_FINISHED = "fifty_books_finished",
}

export interface Badge {
  type: BadgeType;
  progress: number; // a decimal value between 0 and 1 representing the progress towards the badge
  description?: string;
}

export interface BadgeReward {
  type: "wallpaper" | "widget" | "shelf" | "pet" | "decoration";
  url: string;
}

// TODO: Get this figured out
export const BadgeRewards: Record<BadgeType, BadgeReward> = {
  [BadgeType.FIRST_FINISHED_BOOK]: {
    type: "wallpaper",
    url: "https://example.com/first_finished_book_wallpaper.jpg",
  },
  [BadgeType.FIRST_SHARED_BOOK]: {
    type: "widget",
    url: "https://example.com/first_shared_book_widget.png",
  },
  [BadgeType.FIVE_SCIFI_BOOKS_FINISHED]: {
    type: "shelf",
    url: "https://example.com/five_scifi_books_shelf.png",
  },
  [BadgeType.FIVE_FANTASY_BOOKS_FINISHED]: {
    type: "shelf",
    url: "https://example.com/five_fantasy_books_shelf.png",
  },
  [BadgeType.FIVE_NON_FICTION_BOOKS_FINISHED]: {
    type: "shelf",
    url: "https://example.com/five_non_fiction_books_shelf.png",
  },
  [BadgeType.FIVE_ROMANCE_BOOKS_FINISHED]: {
    type: "shelf",
    url: "https://example.com/five_romance_books_shelf.png",
  },
  [BadgeType.FIVE_MYSTERY_BOOKS_FINISHED]: {
    type: "shelf",
    url: "https://example.com/five_mystery_books_shelf.png",
  },
  [BadgeType.FIVE_HORROR_BOOKS_FINISHED]: {
    type: "shelf",
    url: "https://example.com/five_horror_books_shelf.png",
  },
  // [BadgeType.FIVE_THRILLER_BOOKS_FINISHED]: {
  //   type: "shelf",
  //   url: "https://example.com/five_thriller_books_shelf.png",
  // },
  [BadgeType.FIFTEY_BOOKS_FINISHED]: {
    type: "decoration",
    url: "https://example.com/fifty_books_finished_decoration.png",
  },
};

export const BadgeCountRequired: Record<BadgeType, number> = {
  [BadgeType.FIRST_FINISHED_BOOK]: 1,
  [BadgeType.FIRST_SHARED_BOOK]: 1,
  [BadgeType.FIVE_SCIFI_BOOKS_FINISHED]: 5,
  [BadgeType.FIVE_FANTASY_BOOKS_FINISHED]: 5,
  [BadgeType.FIVE_NON_FICTION_BOOKS_FINISHED]: 5,
  [BadgeType.FIVE_ROMANCE_BOOKS_FINISHED]: 5,
  [BadgeType.FIVE_MYSTERY_BOOKS_FINISHED]: 5,
  [BadgeType.FIVE_HORROR_BOOKS_FINISHED]: 5,
  // [BadgeType.FIVE_THRILLER_BOOKS_FINISHED]: 5,
  [BadgeType.FIFTEY_BOOKS_FINISHED]: 50,
};

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
