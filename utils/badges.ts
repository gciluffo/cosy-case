import { BadgeType, Badge, BadgeReward } from "@/models/badge";
import { Book, GenericBookGenre } from "@/models/book";

/**
 * When a book gets put into a finished status, then this function is called.
 * Computes which badges the completed book counts towards
 * @param cases
 * @param newlyCompletedBook
 */
export const calculateBadgeProgressForCompleteBook = (
  newlyCompletedBook: Book,
  existingBadges: Badge[]
): Badge[] => {
  const badgesClone = [...existingBadges];

  // ******** FIRST_FINISHED_BOOK **************
  handleOneTimeBadgeProgress(
    BadgeType.FIRST_FINISHED_BOOK,
    badgesClone,
    newlyCompletedBook
  );

  // ******** FIFTY_BOOKS_FINISHED **************
  handleBadgeProgress(
    BadgeType.FIFTEY_BOOKS_FINISHED,
    badgesClone,
    newlyCompletedBook
  );

  // ******** TWELVE_BOOK_FINISHED_IN_A_YEAR **************
  handleTimeFrameBadgeProgress(
    BadgeType.TWELVE_BOOK_FINISHED_IN_A_YEAR,
    badgesClone,
    "year",
    newlyCompletedBook
  );

  // ******** Genre Specific Badges **************
  const newBookGenre = newlyCompletedBook.genericGenre;

  if (newBookGenre) {
    switch (newBookGenre) {
      case GenericBookGenre.ScienceFiction:
        handleBadgeProgress(
          BadgeType.FIVE_SCIFI_BOOKS_FINISHED,
          badgesClone,
          newlyCompletedBook
        );
        break;
      case GenericBookGenre.Fantasy:
        handleBadgeProgress(
          BadgeType.FIVE_FANTASY_BOOKS_FINISHED,
          badgesClone,
          newlyCompletedBook
        );
        break;
      case GenericBookGenre.NonFiction:
        handleBadgeProgress(
          BadgeType.FIVE_NON_FICTION_BOOKS_FINISHED,
          badgesClone,
          newlyCompletedBook
        );
        break;
      case GenericBookGenre.Romance:
        handleBadgeProgress(
          BadgeType.FIVE_ROMANCE_BOOKS_FINISHED,
          badgesClone,
          newlyCompletedBook
        );
        break;
      case GenericBookGenre.Mystery:
        handleBadgeProgress(
          BadgeType.FIVE_MYSTERY_BOOKS_FINISHED,
          badgesClone,
          newlyCompletedBook
        );
        break;
      case GenericBookGenre.Horror:
        handleBadgeProgress(
          BadgeType.FIVE_HORROR_BOOKS_FINISHED,
          badgesClone,
          newlyCompletedBook
        );
        break;
      case GenericBookGenre.Thriller:
        handleBadgeProgress(
          BadgeType.FIVE_THRILLER_BOOKS_FINISHED,
          badgesClone,
          newlyCompletedBook
        );
      case GenericBookGenre.Historical:
      case GenericBookGenre.History:
        handleBadgeProgress(
          BadgeType.FIVE_HISTORY_BOOKS_FINISHED,
          badgesClone,
          newlyCompletedBook
        );
        break;
      default:
        // No specific badge for this genre
        break;
    }
  }

  return badgesClone;
};

export const handleBadgeProgress = (
  badgeType: BadgeType,
  badges: Badge[],
  newlyCompletedBook?: Book
) => {
  const badge = badges.find((b) => b.type === badgeType);

  const totalCountRequired = BadgeCountRequired[badgeType];

  if (badge && badge.progress < 1) {
    badge.progress = badge.progress + 1 / totalCountRequired;
    if (badge.books && newlyCompletedBook) badge.books.push(newlyCompletedBook);
  } else if (!badge) {
    badges.push({
      type: badgeType,
      progress: 1 / totalCountRequired,
      books: newlyCompletedBook ? [newlyCompletedBook] : [],
    });
  }
};

export const handleOneTimeBadgeProgress = (
  badgeType: BadgeType,
  badges: Badge[],
  newlyCompletedBook?: Book
): Badge[] => {
  const badge = badges.find((b) => b.type === badgeType);

  if (badge) {
    badge.progress = 1;
  } else {
    badges.push({
      type: badgeType,
      progress: 1,
      books: newlyCompletedBook ? [newlyCompletedBook] : [],
    });
  }

  return badges;
};

export const handleTimeFrameBadgeProgress = (
  badgeType: BadgeType,
  badges: Badge[],
  timeFrame: "year" | "month",
  newlyCompletedBook: Book
): Badge[] => {
  const badge = badges.find((b) => b.type === badgeType);

  // if badge.timeStarted year is behind the current year then reset the progress
  if (badge && badge.timeStarted) {
    const timeStartedDate = new Date(badge.timeStarted);
    const currentDate = new Date();

    if (
      timeFrame === "year" &&
      timeStartedDate.getFullYear() < currentDate.getFullYear()
    ) {
      badge.progress = 0;
      badge.timeStarted = new Date().toISOString();
      badge.books = [];
    } else if (
      timeFrame === "month" &&
      timeStartedDate.getMonth() < currentDate.getMonth()
    ) {
      badge.progress = 0;
      badge.timeStarted = new Date().toISOString();
      badge.books = [];
    }
  }

  if (badge && badge.progress < 1) {
    badge.progress += 1 / BadgeCountRequired[badgeType];
    if (badge.books) badge.books.push(newlyCompletedBook);
  } else if (!badge) {
    badges.push({
      type: badgeType,
      progress: 1 / BadgeCountRequired[badgeType],
      timeStarted: new Date().toISOString(),
      books: [newlyCompletedBook],
    });
  }

  return badges;
};

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
  [BadgeType.FIVE_THRILLER_BOOKS_FINISHED]: {
    type: "shelf",
    url: "https://example.com/five_thriller_books_shelf.png",
  },
  [BadgeType.FIFTEY_BOOKS_FINISHED]: {
    type: "decoration",
    url: "https://example.com/fifty_books_finished_decoration.png",
  },
  [BadgeType.TWELVE_BOOK_FINISHED_IN_A_YEAR]: {
    type: "pet",
    url: "https://example.com/twelve_books_finished_in_a_year_pet.png",
  },
  [BadgeType.FIVE_HISTORY_BOOKS_FINISHED]: {
    type: "shelf",
    url: "https://example.com/five_history_books_shelf.png",
  },
  [BadgeType.FIRST_SPINE_IMAGE_UPLOADED]: {
    type: "decoration",
    url: "https://example.com/first_spine_image_uploaded_decoration.png",
  },
  [BadgeType.FIVE_SPINE_IMAGES_UPLOADED]: {
    type: "decoration",
    url: "https://example.com/five_spine_images_uploaded_decoration.png",
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
  [BadgeType.FIVE_THRILLER_BOOKS_FINISHED]: 5,
  [BadgeType.FIVE_HISTORY_BOOKS_FINISHED]: 5,
  [BadgeType.FIFTEY_BOOKS_FINISHED]: 50,
  [BadgeType.TWELVE_BOOK_FINISHED_IN_A_YEAR]: 12,
  [BadgeType.FIRST_SPINE_IMAGE_UPLOADED]: 1,
  [BadgeType.FIVE_SPINE_IMAGES_UPLOADED]: 5,
};

export const BadgeDescription: Record<BadgeType, string> = {
  [BadgeType.FIRST_FINISHED_BOOK]: "Complete your first book.",
  [BadgeType.FIRST_SHARED_BOOK]: "Share a bookcase for the first time.",
  [BadgeType.FIVE_SCIFI_BOOKS_FINISHED]: "Finish 5 science fiction books.",
  [BadgeType.FIVE_FANTASY_BOOKS_FINISHED]: "Finish 5 fantasy books.",
  [BadgeType.FIVE_NON_FICTION_BOOKS_FINISHED]: "Finish 5 non-fiction books.",
  [BadgeType.FIVE_ROMANCE_BOOKS_FINISHED]: "Finish 5 romance books.",
  [BadgeType.FIVE_MYSTERY_BOOKS_FINISHED]: "Finish 5 mystery books.",
  [BadgeType.FIVE_HORROR_BOOKS_FINISHED]: "Finish 5 horror books.",
  [BadgeType.FIVE_THRILLER_BOOKS_FINISHED]: "Finish 5 thriller books.",
  [BadgeType.FIFTEY_BOOKS_FINISHED]: "Finish 50 books in total.",
  [BadgeType.TWELVE_BOOK_FINISHED_IN_A_YEAR]: "Finish 12 books in a year.",
  [BadgeType.FIVE_HISTORY_BOOKS_FINISHED]: "Finish 5 historical books.",
  [BadgeType.FIRST_SPINE_IMAGE_UPLOADED]: "Upload your first book spine image.",
  [BadgeType.FIVE_SPINE_IMAGES_UPLOADED]: "Upload 5 book spine images.",
};
