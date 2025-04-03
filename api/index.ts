import { OpenLibraryBook } from "@/models";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function searchBooks(searchTerm: string) {
  const response = await fetch(
    `${BASE_URL}/search/?query=${searchTerm}&offset=0&limit=10`,
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

  console.log("Searching for book spine with body:", body);

  const response = await fetch(`${BASE_URL}/search-book-spine-image`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch book spine");
  }

  const data = await response.json();
  return data;
}
