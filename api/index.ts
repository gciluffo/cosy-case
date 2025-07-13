import { BookCase } from "@/models/book";
import {
  GoogleBookDetails,
  GoogleBooksSearchResponse,
} from "@/models/google-books";
import { OpenLibraryBook } from "@/models/open-library";
import { captializeFirstLetter } from "@/utils/string";

// const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.2.53:8000";
const BASE_URL = "http://192.168.2.53:8000";

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
        "x-api-key": process.env.EXPO_PUBLIC_API_KEY || "",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }

  const data = await response.json();
  // console.log("Search results:", data);
  return data.docs || [];
}

export async function searchBooksV2(
  searchTerm: string
): Promise<GoogleBooksSearchResponse> {
  const response = await fetch(
    `${BASE_URL}/search-v2?q=${encodeURIComponent(searchTerm)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.EXPO_PUBLIC_API_KEY || "",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }

  const data = await response.json();
  return data;
}

export async function getBookDetails(
  workKey: string,
  editionKey?: string
): Promise<OpenLibraryBook> {
  const formattedWorkKey = workKey.includes("/")
    ? workKey.split("/").pop()
    : workKey;
  let formattedEditionKey;
  if (editionKey && editionKey.includes("/")) {
    formattedEditionKey = editionKey.split("/").pop();
  }

  let url = `${BASE_URL}/books?workKey=${formattedWorkKey}`;
  if (formattedEditionKey) {
    url += `&editionKey=${formattedEditionKey}`;
  }

  // console.log("getting book details", "url:", url);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.EXPO_PUBLIC_API_KEY || "",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch book details");
  }

  const data = await response.json();
  return data;
}

export async function getBookDetailsV2(
  bookId: string
): Promise<GoogleBookDetails> {
  const response = await fetch(`${BASE_URL}/books-v2/${bookId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.EXPO_PUBLIC_API_KEY || "",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch book details");
  }

  const data = await response.json();
  return data;
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

  // console.log("the path is:", `${BASE_URL}/signed-url/${path}`);

  const response = await fetch(`${BASE_URL}/signed-url/${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.EXPO_PUBLIC_API_KEY || "",
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
        "x-api-key": process.env.EXPO_PUBLIC_API_KEY || "",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch book images");
  }

  const data = await response.json();
  return data || [];
}

export async function getWidgetImages(): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/widget-images`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.EXPO_PUBLIC_API_KEY || "",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch book images");
  }

  const data = await response.json();
  return data || [];
}

export async function getWallpaperImages(): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/wallpaper-images`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.EXPO_PUBLIC_API_KEY || "",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch wallpaper images");
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
      "x-api-key": process.env.EXPO_PUBLIC_API_KEY || "",
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
    headers: {
      "x-api-key": process.env.EXPO_PUBLIC_API_KEY || "",
      "Content-Type": "multipart/form-data",
    },
  });

  const result = await response.json();
  return result;
};

export const confirmCroppedImage = async (
  confirm: boolean,
  objectKey: string,
  key: string
): Promise<void> => {
  const formattedKey = key.split("/").pop();
  const response = await fetch(`${BASE_URL}/confirm-cropped-image`, {
    method: "POST",
    body: JSON.stringify({
      confirm,
      object_key: objectKey,
      workId: formattedKey,
    }),
    redirect: "follow",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.EXPO_PUBLIC_API_KEY || "",
    },
  });

  const result = await response.json();
  return result;
};

export const getTrendingBooks = async (
  time: string
): Promise<
  {
    title: string;
    bookId: string;
    cover_url: string;
  }[]
> => {
  const response = await fetch(`${BASE_URL}/trending-books/${time}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "max-age=86400", // Cache for 1 day (86400 seconds)
      "x-api-key": process.env.EXPO_PUBLIC_API_KEY || "",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch trending books");
  }

  const data = await response.json();
  return data;
};

export const getNewYorkTimesBestSellers = async () => {
  const response = await fetch(
    `https://api.nytimes.com/svc/books/v3/lists/overview.json?api-key=zkI8cZg5j06gAyXgAEYvKGb616FUzHAV`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch New York Times best sellers");
  }

  const data = await response.json();

  const fictionBooks = data.results.lists
    .find(
      (l: any) => l.list_name_encoded === "combined-print-and-e-book-fiction"
    )
    ?.books.map((b: any) => ({
      title: captializeFirstLetter(b.title.toLowerCase()),
      bookId: b.primary_isbn13,
      cover_url: b.book_image,
    }));

  const nonFictionBooks = data.results.lists
    .find(
      (l: any) => l.list_name_encoded === "combined-print-and-e-book-nonfiction"
    )
    ?.books.map((b: any) => ({
      title: captializeFirstLetter(b.title.toLowerCase()),
      bookId: b.primary_isbn13,
      cover_url: b.book_image,
    }));

  const graphicNovels = data.results.lists
    .find((l: any) => l.list_name_encoded === "graphic-books-and-manga")
    ?.books.map((b: any) => ({
      title: captializeFirstLetter(b.title.toLowerCase()),
      bookId: b.primary_isbn13,
      cover_url: b.book_image,
    }));

  const adviceAndHowToBooks = data.results.lists
    .find((l: any) => l.list_name_encoded === "advice-how-to-and-miscellaneous")
    ?.books.map((b: any) => ({
      title: captializeFirstLetter(b.title.toLowerCase()),
      bookId: b.primary_isbn13,
      cover_url: b.book_image,
    }));

  return {
    fictionBooks: fictionBooks || [],
    nonFictionBooks: nonFictionBooks || [],
    graphicNovels: graphicNovels || [],
    adviceAndHowToBooks: adviceAndHowToBooks || [],
  };
};

export const uploadBookcaseShareLink = async (
  bookcase: BookCase,
  file: any
) => {
  const formData = new FormData();
  formData.append("bookcase", JSON.stringify(bookcase));
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/create-bookcase-link`, {
    method: "POST",
    body: formData,
    headers: {
      "x-api-key": process.env.EXPO_PUBLIC_API_KEY || "",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to upload bookcase share link");
  }

  const data = await response.json();
  return data;
};

export const getBookcaseShareLink = async (
  shortCode: string
): Promise<{
  bookcase: BookCase;
  image_url: string;
  wallpaper_url?: string;
}> => {
  const response = await fetch(`${BASE_URL}/resolve-link/${shortCode}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.EXPO_PUBLIC_API_KEY || "",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch bookcase share link");
  }

  const data = await response.json();
  return data;
};
