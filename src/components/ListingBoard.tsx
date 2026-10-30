"use client";

import { Listing } from "@/types";
import { ListingCard } from "./ListingCard";
import { PackageOpen, Sparkles } from "lucide-react";

interface ListingBoardProps {
  listings: Listing[];
  isLoading: boolean;
  onActionComplete: () => void;
  activeFilterName?: string;
}

export function ListingBoard({
  listings,
  isLoading,
  onActionComplete,
  activeFilterName,
}: ListingBoardProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div
            key={idx}
            className="rounded-2xl p-6 border border-charcoal-800 bg-charcoal-900/60 animate-pulse space-y-4"
          >
            <div className="flex justify-between items-center">
              <div className="w-20 h-5 bg-charcoal-800 rounded-full" />
              <div className="w-16 h-4 bg-charcoal-800 rounded" />
            </div>
            <div className="w-3/4 h-6 bg-charcoal-800 rounded-md" />
            <div className="space-y-2">
              <div className="w-full h-4 bg-charcoal-800 rounded" />
              <div className="w-5/6 h-4 bg-charcoal-800 rounded" />
            </div>
            <div className="w-1/2 h-8 bg-charcoal-800 rounded-xl" />
            <div className="pt-4 border-t border-charcoal-800 flex justify-between">
              <div className="w-24 h-4 bg-charcoal-800 rounded" />
              <div className="w-20 h-4 bg-charcoal-800 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-charcoal-800 bg-charcoal-900/40 p-12 text-center">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-charcoal-850 border border-charcoal-700/80 flex items-center justify-center text-charcoal-400 mb-4">
          <PackageOpen className="w-6 h-6 text-purple-light/70" />
        </div>
        <h3 className="text-base font-semibold text-white mb-1">
          No listings found
        </h3>
        <p className="text-xs text-charcoal-400 max-w-sm mx-auto">
          {activeFilterName
            ? `There are no items currently matching "${activeFilterName}". Try switching tabs or publishing a new one.`
            : "No items have been posted to the blockchain yet. Be the first to publish a lost or found listing!"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {listings.map((listing) => (
        <ListingCard
          key={listing.id.toString()}
          listing={listing}
          onActionComplete={onActionComplete}
        />
      ))}
    </div>
  );
}

