import BookDetails from "@/app/book-details";
import {
  Badge,
  BadgeCountRequired,
  BadgeType,
  Book,
  GenericBookGenre,
} from "@/models/book";
import { OpenLibraryBook } from "@/models/open-library";

/**
 * Returns the rendered width (in pixels) for a book spine,
 * based on page count and the original image dimensions.
 *
 * @param pageCount - Number of pages in the book
 * @param originalWidth - Original image width in pixels
 * @param originalHeight - Original image height in pixels
 * @param targetHeight - Desired render height (in pixels)
 */
export function getBookSpineWidth(
  pageCount: number,
  originalWidth: number,
  originalHeight: number,
  targetHeight: number
): number {
  const MIN_THICKNESS = 30; // min "visual thickness" for thin books
  const MAX_THICKNESS = 80; // max for thick books
  const MIN_PAGES = 50;
  const MAX_PAGES = 1000;

  // Prevent division by zero or invalid dimensions
  if (!originalWidth || !originalHeight || targetHeight <= 0)
    return MIN_THICKNESS;

  // Scale factor for original image dimensions
  const baseAspectRatio = originalWidth / originalHeight;

  // Determine thickness from page count
  let visualThickness: number;
  if (!pageCount || pageCount < MIN_PAGES) {
    visualThickness = MIN_THICKNESS;
  } else if (pageCount >= MAX_PAGES) {
    visualThickness = MAX_THICKNESS;
  } else {
    const ratio = (pageCount - MIN_PAGES) / (MAX_PAGES - MIN_PAGES);
    visualThickness = MIN_THICKNESS + ratio * (MAX_THICKNESS - MIN_THICKNESS);
  }

  // Apply aspect ratio from original image at target height
  const spineNaturalWidth = baseAspectRatio * targetHeight;

  // Use the lesser of the visual thickness or natural scaled width
  return Math.round(Math.min(spineNaturalWidth, visualThickness));
}

/**
 * Converts physical dimensions to a pixel height, relative to the tallest book.
 *
 * @param dimensionsStr - string like "6 x 9.2 x 1.5 inches"
 * @param maxHeightPx - the tallest book height in pixels
 * @param maxHeightInches - the tallest book height in inches (used for scaling)
 * @returns number of pixels for book height
 */
export function getBookHeightPx(
  dimensionsStr: string,
  maxHeightPx: number,
  maxHeightInches: number = 11
): number {
  if (!dimensionsStr || !maxHeightPx) return maxHeightPx; // fallback to full height

  const match = dimensionsStr
    .toLowerCase()
    .replace("inches", "")
    .trim()
    .split("x")
    .map((dim) => parseFloat(dim));

  if (match.length !== 3 || match.some(isNaN)) return maxHeightPx;

  const heightInInches = Math.max(...match); // safest assumption
  const scale = heightInInches / maxHeightInches;

  const clampedScale = Math.max(0.5, Math.min(1, scale)); // avoid super short books
  return Math.round(maxHeightPx * clampedScale);
}

export function isStringIsbn13(isbn: string): boolean {
  // Check if the ISBN is a valid 13-digit number
  return /^\d{13}$/.test(isbn);
}

export const getBookDescription = (book: Book | OpenLibraryBook) => {
  if (
    typeof book.description === "object" &&
    book.description?.type === "/type/text"
  ) {
    return book.description.value;
  } else if (typeof book.description === "string") {
    return book.description;
  } else {
    return "No description available";
  }
};

export const getGenreChartData = (
  books: Book[]
): { label: string; value: number }[] => {
  const genreCounts: Record<string, number> = {};

  books.forEach((book) => {
    if (book.genericGenre) {
      genreCounts[book.genericGenre] =
        (genreCounts[book.genericGenre] || 0) + 1;
    }
  });

  return Object.entries(genreCounts).map(([label, value]) => ({
    label,
    value,
  }));
};

// "categories": [
//             "Fiction / Fantasy / General",
//             "Fiction / Fantasy / Epic",
//             "Fiction / Fantasy / Action & Adventure",
//             "Fiction / Fantasy / Military"
//         ],
// ...existing code...
export const getGenericGenreFromCategories = (
  categories: string[]
): GenericBookGenre | undefined => {
  return Object.values(GenericBookGenre).find((genre) =>
    categories.some((cat) => cat.includes(genre))
  );
};

export const getBookGenericGenresFromSubjects = (
  subjects: string[]
): GenericBookGenre[] => {
  const genres: GenericBookGenre[] = [];
  for (const subject of subjects) {
    const normalizedSubject = subject.toLowerCase().trim();
    if (
      Object.values(GenericBookGenre)
        .map((g) => g.toLowerCase().trim())
        .includes(normalizedSubject)
    ) {
      genres.push(subject as GenericBookGenre);
    }
  }
  return genres;
};
