export enum ListingType {
  Lost = 0,
  Found = 1,
}

export interface Listing {
  id: bigint;
  name: string;
  description: string;
  location: string;
  listingType: ListingType;
  poster: `0x${string}`;
  timestamp: bigint;
  isResolved: boolean;
  isDeleted: boolean;
}

export type FilterStatus = "all" | "lost" | "found" | "resolved" | "my-listings";

export interface CreateListingFormValues {
  name: string;
  description: string;
  location: string;
  listingType: ListingType;
}

export interface ListingStats {
  total: number;
  lost: number;
  found: number;
  resolved: number;
}

