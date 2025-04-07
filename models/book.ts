import { OpenLibraryBook, OpenLibraryBookSearch } from "./external";

export type PlaceHolderSpine = {
  primaryColor: string;
  title: string;
  author: string;
  width: number;
  height: number;
  selected: boolean;
};

export type SpineImage = {
  imageUrl: string;
  width: number;
  height: number;
  selected: boolean;
};

export type Spine = PlaceHolderSpine | SpineImage;

export type Book = OpenLibraryBook &
  OpenLibraryBookSearch & {
    spines: Spine[];
  };

export const isPlaceHolderSpine = (spine: Spine): spine is PlaceHolderSpine => {
  return (spine as PlaceHolderSpine).primaryColor !== undefined;
};
