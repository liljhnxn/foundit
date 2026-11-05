export const FOUND_IT_ABI = [
  {
    type: "function",
    name: "createListing",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_name", type: "string" },
      { name: "_description", type: "string" },
      { name: "_location", type: "string" },
      { name: "_listingType", type: "uint8" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "resolveListing",
    stateMutability: "nonpayable",
    inputs: [{ name: "_id", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "deleteListing",
    stateMutability: "nonpayable",
    inputs: [{ name: "_id", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "getAllListings",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        components: [
          { name: "id", type: "uint256" },
          { name: "name", type: "string" },
          { name: "description", type: "string" },
          { name: "location", type: "string" },
          { name: "listingType", type: "uint8" },
          { name: "poster", type: "address" },
          { name: "timestamp", type: "uint256" },
          { name: "isResolved", type: "bool" },
          { name: "isDeleted", type: "bool" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "getMyListings",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        components: [
          { name: "id", type: "uint256" },
          { name: "name", type: "string" },
          { name: "description", type: "string" },
          { name: "location", type: "string" },
          { name: "listingType", type: "uint8" },
          { name: "poster", type: "address" },
          { name: "timestamp", type: "uint256" },
          { name: "isResolved", type: "bool" },
          { name: "isDeleted", type: "bool" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "getListing",
    stateMutability: "view",
    inputs: [{ name: "_id", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "id", type: "uint256" },
          { name: "name", type: "string" },
          { name: "description", type: "string" },
          { name: "location", type: "string" },
          { name: "listingType", type: "uint8" },
          { name: "poster", type: "address" },
          { name: "timestamp", type: "uint256" },
          { name: "isResolved", type: "bool" },
          { name: "isDeleted", type: "bool" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "totalListingsCount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "event",
    name: "ListingCreated",
    inputs: [
      { name: "id", type: "uint256", indexed: true },
      { name: "poster", type: "address", indexed: true },
      { name: "name", type: "string", indexed: false },
      { name: "listingType", type: "uint8", indexed: false },
      { name: "location", type: "string", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "ListingResolved",
    inputs: [
      { name: "id", type: "uint256", indexed: true },
      { name: "poster", type: "address", indexed: true },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "ListingDeleted",
    inputs: [
      { name: "id", type: "uint256", indexed: true },
      { name: "poster", type: "address", indexed: true },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
] as const;

export const CONTRACT_ADDRESS: `0x${string}` =
  (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`) ||
  "0xBb7dc02D4F4f28471b2a0740B12fdABF05A991B1";

