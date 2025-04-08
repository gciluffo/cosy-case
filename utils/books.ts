/**
 * Returns the width (in pixels) for a book spine based on page count.
 * @param pageCount - number of pages in the book
 */
export function getBookSpineWidth(pageCount: number): number {
  const MIN_WIDTH = 30; // thin paperback
  const MAX_WIDTH = 80; // super thick hardcover
  const MIN_PAGES = 50;
  const MAX_PAGES = 1000;

  if (!pageCount || pageCount < MIN_PAGES) {
    return MIN_WIDTH;
  }

  if (pageCount >= MAX_PAGES) {
    return MAX_WIDTH;
  }

  // Linear interpolation
  const ratio = (pageCount - MIN_PAGES) / (MAX_PAGES - MIN_PAGES);
  return Math.round(MIN_WIDTH + ratio * (MAX_WIDTH - MIN_WIDTH));
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
