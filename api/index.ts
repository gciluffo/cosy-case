import { OpenLibraryBook } from "@/models/external";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.2.53:8000";

export async function searchBooks(searchTerm: string) {
  console.log(
    "Searching for books with term:",
    `${BASE_URL}/search/?query=${searchTerm}&offset=0&limit=10`
  );
  const response = await fetch(
    `${BASE_URL}/search/?query=${encodeURIComponent(
      searchTerm
    )}&offset=0&limit=10`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }

  const data = await response.json();
  return data.docs || [];
}

export async function getBookDetails(key: string): Promise<OpenLibraryBook> {
  // key is formatted as /works/OL1234567W
  // Get id after the last /
  const formattedKey = key.split("/").pop();
  const response = await fetch(`${BASE_URL}/book/${formattedKey}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch book details");
  }

  const data = await response.json();
  return data[`OLID:${formattedKey}`];
}

export async function getBookSpineBucketPathFromSignedUrl(
  signedUrl: string,
  key: string
): Promise<string> {
  const url = new URL(signedUrl);
  const pathParts = url.pathname.split("/");
  const formattedKey = key.split("/").pop();
  const fileName = pathParts[pathParts.length - 1];
  const path = `${formattedKey}/${fileName}`;

  console.log("the path is:", `${BASE_URL}/signed-url/${path}`);

  const response = await fetch(`${BASE_URL}/signed-url/${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch book images");
  }

  const data = await response.json();
  return data.signed_url || "";
}

export async function getSpineImages(key: string): Promise<string[]> {
  const formattedKey = key.split("/").pop();
  const response = await fetch(
    `${BASE_URL}/book/${formattedKey}/spine-images`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch book images");
  }

  const data = await response.json();
  return data || [];
}

export async function searchBookSpineByTitle(
  title: string,
  author: string,
  key: string
): Promise<{
  signed_url: string;
  title_score: number;
  author_score: number;
}> {
  const body = {
    title,
    author,
    workId: key.split("/").pop(),
  };

  // console.log("Searching for book spine with body:", body);

  const response = await fetch(`${BASE_URL}/search-book-spine-image`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error("Failed to find spine on google");
  }

  const data = await response.json();
  return data;
}

export const uploadImageForSpineDetection = async (
  file: any,
  key: string,
  title: string,
  author: string
): Promise<{
  message: string;
  signed_urls: string[];
  title_score: number;
  author_score: number;
}> => {
  const formattedKey = key.split("/").pop();
  const formData = new FormData();
  formData.append("file", file);
  formData.append("workId", formattedKey!);
  formData.append("title", title);
  formData.append("author", author);

  const response = await fetch(`${BASE_URL}/get-spine-from-image`, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();
  return result;
};

export const confirmCroppedImage = async (
  objectKey: string,
  key: string
): Promise<void> => {
  const formattedKey = key.split("/").pop();
  const response = await fetch(`${BASE_URL}/confirm-cropped-image`, {
    method: "POST",
    body: JSON.stringify({
      object_key: objectKey,
      workId: formattedKey,
    }),
    redirect: "follow",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();
  return result;
};
