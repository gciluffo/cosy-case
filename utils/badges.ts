import {
  BadgeType,
  Badge,
  BadgeCountRequired,
  Book,
  GenericBookGenre,
} from "@/models/book";

const handleBadgeProgress = (badgeType: BadgeType, badges: Badge[]) => {
  const badge = badges.find((b) => b.type === badgeType);

  const totalCountRequired = BadgeCountRequired[badgeType];

  if (badge && badge.progress < 1) {
    badge.progress = badge.progress + 1 / totalCountRequired;
  } else if (!badge) {
    badges.push({
      type: badgeType,
      progress: 1 / totalCountRequired,
    });
  }
};

/**
 * When a book gets put into a finished status, then this function is called.
 * Computes which badges the completed book counts towards
 * @param cases
 * @param newlyCompletedBook
 */
export const calculateBadgeProgress = (
  newlyCompletedBook: Book,
  existingBadges: Badge[]
): Badge[] => {
  console.log("Calculating badge progress for book:");
  const badgesClone = [...existingBadges];

  // ******** FIRST_FINISHED_BOOK **************
  handleOneTimeBadgeProgress(BadgeType.FIRST_FINISHED_BOOK, badgesClone);

  // ******** FIFTY_BOOKS_FINISHED **************
  handleBadgeProgress(BadgeType.FIFTEY_BOOKS_FINISHED, badgesClone);

  // ******** Genre Specific Badges **************
  const newBookGenre = newlyCompletedBook.genericGenre;

  if (newBookGenre) {
    switch (newBookGenre) {
      case GenericBookGenre.ScienceFiction:
        handleBadgeProgress(BadgeType.FIVE_SCIFI_BOOKS_FINISHED, badgesClone);
        break;
      case GenericBookGenre.Fantasy:
        handleBadgeProgress(BadgeType.FIVE_FANTASY_BOOKS_FINISHED, badgesClone);
        break;
      case GenericBookGenre.NonFiction:
        handleBadgeProgress(
          BadgeType.FIVE_NON_FICTION_BOOKS_FINISHED,
          badgesClone
        );
        break;
      case GenericBookGenre.Romance:
        handleBadgeProgress(BadgeType.FIVE_ROMANCE_BOOKS_FINISHED, badgesClone);
        break;
      case GenericBookGenre.Mystery:
        handleBadgeProgress(BadgeType.FIVE_MYSTERY_BOOKS_FINISHED, badgesClone);
        break;
      case GenericBookGenre.Horror:
        handleBadgeProgress(BadgeType.FIVE_HORROR_BOOKS_FINISHED, badgesClone);
        break;
      // case GenericBookGenre.Thriller:
      //   handleBadgeProgress(BadgeType.FIVE_THRILLER_BOOKS_FINISHED, existingBadgesClone);
      //   break;
      default:
        // No specific badge for this genre
        break;
    }
  }

  return badgesClone;
};

export const handleOneTimeBadgeProgress = (
  badgeType: BadgeType,
  badges: Badge[]
): Badge[] => {
  const badgeClone = [...badges];
  const badge = badgeClone.find((b) => b.type === badgeType);

  if (badge) {
    badge.progress = 1;
  } else {
    badgeClone.push({
      type: badgeType,
      progress: 1,
    });
  }

  return badgeClone;
};
