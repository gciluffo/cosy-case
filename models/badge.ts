export enum BadgeType {
  FIRST_FINISHED_BOOK = "first_finished_book",
  FIRST_SHARED_BOOK = "first_shared_book",
  FIVE_SCIFI_BOOKS_FINISHED = "five_scifi_books_finished",
  FIVE_FANTASY_BOOKS_FINISHED = "five_fantasy_books_finished",
  FIVE_NON_FICTION_BOOKS_FINISHED = "five_non_fiction_books_finished",
  FIVE_ROMANCE_BOOKS_FINISHED = "five_romance_books_finished",
  FIVE_MYSTERY_BOOKS_FINISHED = "five_mystery_books_finished",
  FIVE_HORROR_BOOKS_FINISHED = "five_horror_books_finished",
  FIVE_THRILLER_BOOKS_FINISHED = "five_thriller_books_finished",
  FIFTEY_BOOKS_FINISHED = "fifty_books_finished",
  TWELVE_BOOK_FINISHED_IN_A_YEAR = "twelve_books_finished_in_a_year",
}

export interface Badge {
  type: BadgeType;
  progress: number; // a decimal value between 0 and 1 representing the progress towards the badge
  timeStarted?: string; // ISO date string when the badge was started
}

export interface BadgeReward {
  type: "wallpaper" | "widget" | "shelf" | "pet" | "decoration";
  url: string;
}
