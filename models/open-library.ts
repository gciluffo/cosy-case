export interface OpenLibraryBookSearchResponse {
  numFound: number;
  start: number;
  numFoundExact: boolean;
  docs: OpenLibraryBookSearch[];
}

export interface OpenLibraryBookSearch {
  author_name: string[];
  cover_edition_key: string;
  first_publish_year: number;
  key: string;
  title: string;
  cover_url: string;
  editions: {
    numFound: number;
    start: number;
    numFoundExact: boolean;
    docs: Array<{
      key: string;
      title: string;
    }>;
  };
}

export interface OpenLibraryBook {
  author: string | null;
  description:
    | string
    | {
        value: string;
        type: string;
      }
    | null;
  isbn_10: string[];
  isbn_13: string[] | null;
  lauguages: Array<{ key: string }>; // Note: original key is "lauguages" (typo?), usually it's "languages"
  number_of_pages: number | null;
  physical_dimensions: string | null;
  publish_date: string;
  publishers: string[];
  subject_people: string[];
  subject_places: string[];
  subject_times: string[] | null;
  subjects: string[];
  title: string;
  subtitle: string | null;
  ratings: RatingSummary;
  cover_url: string;
  edition_key: string;
  key: string;
}

interface RatingSummary {
  summary: {
    average: number;
    count: number;
    sortable: number;
  };
  counts: {
    [rating: string]: number; // keys like "1", "2", "3", etc.
  };
}

export interface GoogleSearchResponse {}
