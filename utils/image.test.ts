import { getObjectKeyFromSignedUrl } from "./image";

describe("getObjectKeyFromSignedUrl", () => {
  it("should extract objectKey and bucketName from a typical signed URL", () => {
    const url =
      "https://storage.googleapis.com/my-bucket/images/book_spine_20240610_123456_w200_h300.jpg?X-Goog-Algorithm=GOOG4-RSA-SHA256";
    const { objectKey, bucketName } = getObjectKeyFromSignedUrl(url);
    expect(bucketName).toBe("my-bucket");
    expect(objectKey).toBe("images/book_spine_20240610_123456_w200_h300.jpg");
  });

  it("should handle URLs with deeper paths", () => {
    const url =
      "https://storage.googleapis.com/bucket-name/folder1/folder2/file.jpg?token=abc";
    const { objectKey, bucketName } = getObjectKeyFromSignedUrl(url);
    expect(bucketName).toBe("bucket-name");
    expect(objectKey).toBe("folder1/folder2/file.jpg");
  });

  it("should handle URLs with only bucket and file", () => {
    const url = "https://storage.googleapis.com/bucket/file.jpg";
    const { objectKey, bucketName } = getObjectKeyFromSignedUrl(url);
    expect(bucketName).toBe("bucket");
    expect(objectKey).toBe("file.jpg");
  });

  it("should return empty objectKey if no object path exists", () => {
    const url = "https://storage.googleapis.com/bucket/";
    const { objectKey, bucketName } = getObjectKeyFromSignedUrl(url);
    expect(bucketName).toBe("bucket");
    expect(objectKey).toBe("");
  });
});

// We recommend installing an extension to run jest tests.
