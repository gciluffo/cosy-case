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
