"use client";

import { FilterStatus } from "@/types";
import { Package, HelpCircle, Search, CheckCircle2, User, SearchIcon } from "lucide-react";

interface FiltersProps {
  currentFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  counts: {
    all: number;
    lost: number;
    found: number;
    resolved: number;
    myListings: number;
  };
  isWalletConnected: boolean;
}

export function Filters({
  currentFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  counts,
  isWalletConnected,
}: FiltersProps) {
  const tabs = [
    { id: "all" as FilterStatus, label: "All Items", icon: Package, count: counts.all },
    { id: "lost" as FilterStatus, label: "Lost Items", icon: HelpCircle, count: counts.lost },
    { id: "found" as FilterStatus, label: "Found Items", icon: Search, count: counts.found },
    { id: "resolved" as FilterStatus, label: "Resolved", icon: CheckCircle2, count: counts.resolved },
  ];

  if (isWalletConnected) {
    tabs.push({
      id: "my-listings" as FilterStatus,
      label: "My Listings",
      icon: User,
      count: counts.myListings,
    });
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onFilterChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-150 border ${
                isActive
                  ? "bg-purple-dim/80 text-white border-purple-500/60 shadow-glow-purple"
                  : "bg-charcoal-900 text-charcoal-400 border-charcoal-800 hover:text-charcoal-200 hover:border-charcoal-700 hover:bg-charcoal-850"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-purple-light" : "text-charcoal-400"}`} />
              <span>{tab.label}</span>
              <span
                className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isActive
                    ? "bg-purple-500/30 text-purple-200"
                    : "bg-charcoal-800 text-charcoal-400"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative min-w-[240px]">
        <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter by keyword or location..."
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-charcoal-900 border border-charcoal-800 text-white placeholder-charcoal-500 focus:outline-none focus:border-purple-500/80 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-white text-xs"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

