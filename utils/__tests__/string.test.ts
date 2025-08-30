import { stripHtmlTags } from "../string";

describe("stripHtmlTags", () => {
  it("should remove HTML tags", () => {
    const htmlString = "<b>INSTANT <i>NEW YORK TIMES</i> BESTSELLER</b>";
    const expected = "INSTANT NEW YORK TIMES BESTSELLER";
    expect(stripHtmlTags(htmlString)).toBe(expected);
  });

  it("should replace HTML entities", () => {
    const htmlString = "&quot;Propulsive.&quot; —<i>The Washington Post</i>";
    const expected = '"Propulsive." —The Washington Post';
    expect(stripHtmlTags(htmlString)).toBe(expected);
  });

  it("should handle line breaks and clean up whitespace", () => {
    const htmlString = "<b>Title</b><br><br>Some text<br>More text";
    const expected = "Title Some text More text";
    expect(stripHtmlTags(htmlString)).toBe(expected);
  });

  it("should handle complex HTML with multiple entities", () => {
    const htmlString =
      '<b>INSTANT <i>NEW YORK TIMES</i> BESTSELLER<br><br>"Propulsive." —<i>The Washington Post</i></b>';
    const expected =
      'INSTANT NEW YORK TIMES BESTSELLER "Propulsive." —The Washington Post';
    expect(stripHtmlTags(htmlString)).toBe(expected);
  });

  it("should return empty string for null/undefined input", () => {
    expect(stripHtmlTags("")).toBe("");
    expect(stripHtmlTags(null as any)).toBe("");
    expect(stripHtmlTags(undefined as any)).toBe("");
  });

  it("should handle plain text without changes", () => {
    const plainText = "This is plain text without HTML";
    expect(stripHtmlTags(plainText)).toBe(plainText);
  });
});
