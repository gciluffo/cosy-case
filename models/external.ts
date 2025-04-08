export interface OpenLibraryBookSearchResponse {
  numFound: number;
  start: number;
  numFoundExact: boolean;
  docs: OpenLibraryBookSearch[];
}

export interface OpenLibraryBookSearch {
  key: string;
  title: string;
  author_name: string[];
  cover_i?: number;
  first_publish_year: number;
  author_key: string[];
  cover_edition_key: string;
  cover_url: string;
  edition_count: number;
  has_fulltext: boolean;
  ia?: string[];
  language?: string[];
  lending_edition_s?: string;
  lending_identifier_s?: string;
}

export interface OpenLibraryBook {
  bib_key: string;
  info_url: string;
  preview: string;
  preview_url: string;
  thumbnail_url: string;
  details: BookDetails;
}

interface BookDetails {
  identifiers: Identifiers;
  series?: string[];
  covers?: number[];
  languages?: { key: string }[];
  genres?: string[];
  source_records?: string[];
  title: string;
  edition_name?: string;
  subjects?: string[];
  publish_country?: string;
  by_statement?: string;
  type: { key: string };
  location?: string[];
  publishers?: string[];
  description?: string;
  physical_format?: string;
  key: string;
  authors?: Author[];
  publish_places?: string[];
  oclc_number?: string[];
  pagination?: string;
  classifications?: Record<string, unknown>;
  notes?: string;
  number_of_pages?: number;
  publish_date?: string;
  copyright_date?: string;
  works?: { key: string }[];
  ocaid?: string;
  isbn_10?: string[];
  isbn_13?: string[];
  oclc_numbers?: string[];
  lc_classifications?: string[];
  latest_revision?: number;
  revision?: number;
  created: DateTimeValue;
  last_modified: DateTimeValue;
  // "physical_dimensions": "1 x 1 x 1 inches",
  physical_dimensions?: string;
}

interface Identifiers {
  alibris_id?: string[];
  google?: string[];
  librarything?: string[];
  goodreads?: string[];
}

interface Author {
  key: string;
  name: string;
}

interface DateTimeValue {
  type: string;
  value: string;
}

export interface OpenLibraryBookResponse {
  [key: string]: OpenLibraryBook;
}
