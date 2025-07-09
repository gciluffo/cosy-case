import { BookCase, BookSortOrder } from "@/models/book";

export const BOOK_CASES: BookCase[] = [
  {
    name: "default",
    topImageKey: "birchTop",
    middleImageKey: "birchMiddle",
    bottomImageKey: "birchBottom",
    offsetXPercent: 0.05,
    offsetYPercent: 0.07,
    books: [],
    isDefault: false,
    widgets: [],
  },
];

export const sortBookcase = (bookCase: BookCase, sort: BookSortOrder): void => {
  switch (sort) {
    case BookSortOrder.DATE_ADDED:
      bookCase?.books.sort(
        (a, b) =>
          new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      );
      break;
    case BookSortOrder.TITLE:
      bookCase?.books.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case BookSortOrder.AUTHOR:
      bookCase?.books.sort((a, b) =>
        (a.author ?? "").localeCompare(b.author ?? "")
      );
      break;
    // case BookSortOrder.GENRE:
    //   bookCase?.books.sort((a, b) => (a.genre ?? "").localeCompare(b.genre ?? ""));
    //   break;
    case BookSortOrder.COLOR:
      // sort by primary color of the spine. Each book has a spines array with a selected property
      bookCase?.books.sort((a, b) => {
        const aSelectedSpine = a.spines.find((s) => s.selected);
        const bSelectedSpine = b.spines.find((s) => s.selected);
        const aColor =
          aSelectedSpine && aSelectedSpine.colors
            ? aSelectedSpine.colors.primary
            : a.colors.primary;
        const bColor =
          bSelectedSpine && bSelectedSpine.colors
            ? bSelectedSpine.colors.primary
            : b.colors.primary;
        return aColor.localeCompare(bColor);
      });
      break;
    default:
      break;
  }
};
