"use client";

import { useState, useMemo } from "react";
import { useAccount, useReadContract } from "wagmi";
import { Header } from "@/components/Header";
import { StatsBar } from "@/components/StatsBar";
import { CreateListingForm } from "@/components/CreateListingForm";
import { Filters } from "@/components/Filters";
import { ListingBoard } from "@/components/ListingBoard";
import { FOUND_IT_ABI, CONTRACT_ADDRESS } from "@/contracts/foundItAbi";
import { Listing, FilterStatus, ListingType } from "@/types";
import { RefreshCw, ShieldCheck, ArrowRight, Compass } from "lucide-react";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [currentFilter, setCurrentFilter] = useState<FilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Read all listings directly from smart contract
  const {
    data: rawListings,
    isLoading: isLoadingListings,
    refetch,
    isRefetching,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: FOUND_IT_ABI,
    functionName: "getAllListings",
  });

  const listings: Listing[] = useMemo(() => {
    if (!rawListings) return [];
    return (rawListings as any[]).map((item) => ({
      id: BigInt(item.id),
      name: item.name,
      description: item.description,
      location: item.location,
      listingType: Number(item.listingType) as ListingType,
      poster: item.poster as `0x${string}`,
      timestamp: BigInt(item.timestamp),
      isResolved: item.isResolved,
      isDeleted: item.isDeleted,
    }));
  }, [rawListings]);

  // Compute stats
  const stats = useMemo(() => {
    let total = listings.length;
    let lost = 0;
    let found = 0;
    let resolved = 0;

    for (const item of listings) {
      if (item.isResolved) resolved++;
      if (item.listingType === ListingType.Lost) lost++;
      if (item.listingType === ListingType.Found) found++;
    }

    return { total, lost, found, resolved };
  }, [listings]);

  // Compute counts for filter tabs
  const filterCounts = useMemo(() => {
    const all = listings.length;
    const lost = listings.filter((i) => i.listingType === ListingType.Lost).length;
    const found = listings.filter((i) => i.listingType === ListingType.Found).length;
    const resolved = listings.filter((i) => i.isResolved).length;
    const myListings = address
      ? listings.filter((i) => i.poster.toLowerCase() === address.toLowerCase()).length
      : 0;

    return { all, lost, found, resolved, myListings };
  }, [listings, address]);

  // Filter & Search listings
  const filteredListings = useMemo(() => {
    let result = [...listings];

    // Filter by tab
    if (currentFilter === "lost") {
      result = result.filter((i) => i.listingType === ListingType.Lost);
    } else if (currentFilter === "found") {
      result = result.filter((i) => i.listingType === ListingType.Found);
    } else if (currentFilter === "resolved") {
      result = result.filter((i) => i.isResolved);
    } else if (currentFilter === "my-listings") {
      if (address) {
        result = result.filter(
          (i) => i.poster.toLowerCase() === address.toLowerCase()
        );
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.location.toLowerCase().includes(q)
      );
    }

    // Sort newest first
    return result.sort((a, b) => Number(b.timestamp - a.timestamp));
  }, [listings, currentFilter, searchQuery, address]);

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="min-h-screen flex flex-col bg-charcoal-950 text-charcoal-100">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Hero Banner / Intro */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-charcoal-900 via-charcoal-850 to-charcoal-900 border border-charcoal-800 p-8 sm:p-10 shadow-card">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-dim/40 border border-emerald-500/20 text-emerald-light text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Decentralized &amp; Tamper-Proof on BOT Chain Mainnet</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Lost something? <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-light via-purple-soft to-emerald-light">
                Find it here.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-charcoal-300 leading-relaxed max-w-xl">
              FoundIt connects honest finders with worried owners. All listings are immutable records on BOT Chain Mainnet. Connect your wallet to publish or manage items.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowCreateForm((prev) => !prev)}
                className="px-5 py-2.5 rounded-xl bg-purple-brand hover:bg-purple-light text-white font-medium text-xs sm:text-sm shadow-card hover:shadow-glow-purple transition-all duration-200 flex items-center gap-2"
              >
                <span>{showCreateForm ? "Hide Publish Form" : "Create New Listing"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleRefresh}
                disabled={isRefetching}
                className="px-4 py-2.5 rounded-xl bg-charcoal-800/80 hover:bg-charcoal-700/80 text-charcoal-200 border border-charcoal-700/60 font-medium text-xs sm:text-sm transition-all duration-200 flex items-center gap-2"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isRefetching ? "animate-spin text-purple-light" : ""}`}
                />
                <span>{isRefetching ? "Syncing..." : "Sync Blockchain"}</span>
              </button>
              <a
                href={`https://scan.botchain.ai/address/${CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-charcoal-850 hover:bg-charcoal-800 text-emerald-light border border-emerald-500/30 font-medium text-xs sm:text-sm transition-all duration-200 flex items-center gap-1.5"
                title="View Smart Contract on BOT Chain Explorer"
              >
                <span>Verified Contract</span>
                <span className="text-[10px] text-charcoal-400">↗</span>
              </a>
            </div>
          </div>
          {/* Subtle background glow */}
          <div className="absolute top-1/2 -right-20 -translate-y-1/2 w-80 h-80 bg-purple-brand/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 right-40 w-60 h-60 bg-emerald-brand/10 rounded-full blur-3xl pointer-events-none" />
        </section>

        {/* Statistics Bar */}
        <section>
          <StatsBar stats={stats} isLoading={isLoadingListings} />
        </section>

        {/* Collapsible / Expandable Create Listing Section */}
        {showCreateForm && (
          <section className="transition-all duration-300">
            <CreateListingForm
              onSuccess={() => {
                refetch();
                setShowCreateForm(false);
              }}
            />
          </section>
        )}

        {/* Listing Board & Filters */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal-800 pb-4">
            <div className="flex items-center gap-2.5">
              <Compass className="w-5 h-5 text-purple-light" />
              <h2 className="text-xl font-bold tracking-tight text-white">
                Item Board
              </h2>
            </div>

            {!showCreateForm && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="self-start sm:self-auto text-xs font-medium text-purple-soft hover:text-purple-300 underline underline-offset-4"
              >
                + Publish an item
              </button>
            )}
          </div>

          {/* Filters & Search */}
          <Filters
            currentFilter={currentFilter}
            onFilterChange={setCurrentFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            counts={filterCounts}
            isWalletConnected={isConnected}
          />

          {/* Board of Cards */}
          <ListingBoard
            listings={filteredListings}
            isLoading={isLoadingListings}
            onActionComplete={() => refetch()}
            activeFilterName={
              currentFilter === "all"
                ? undefined
                : currentFilter === "lost"
                ? "Lost Items"
                : currentFilter === "found"
                ? "Found Items"
                : currentFilter === "resolved"
                ? "Resolved Items"
                : "My Listings"
            }
          />
        </section>
      </main>

      {/* Ecosystem Section & Footer */}
      <footer className="mt-auto border-t border-charcoal-800/80 bg-charcoal-950/90 py-10 text-xs text-charcoal-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* BOT Chain Ecosystem Banner */}
          <div className="rounded-2xl bg-charcoal-900/80 border border-charcoal-800 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500/20 via-emerald-600/30 to-purple-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm tracking-wider shadow-glow-emerald">
                BOT
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-white tracking-wide">
                    Powered by BOT Chain
                  </h4>
                  <span className="px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase rounded-full bg-emerald-dim/50 text-emerald-light border border-emerald-500/30">
                    Mainnet (Chain ID 677)
                  </span>
                </div>
                <p className="text-xs text-charcoal-400 mt-0.5">
                  High-speed, low-fee decentralized infrastructure for autonomous Web3 applications.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://botchain.ai"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-charcoal-850 hover:bg-charcoal-800 text-charcoal-200 hover:text-white border border-charcoal-700/70 hover:border-charcoal-600 font-medium transition-all flex items-center gap-1.5"
              >
                <span>BOT Chain Website</span>
                <span className="text-[11px] text-charcoal-400">↗</span>
              </a>
              <a
                href="https://scan.botchain.ai"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-dim/40 hover:bg-emerald-dim/60 text-emerald-light border border-emerald-500/40 hover:border-emerald-500/60 font-medium transition-all flex items-center gap-1.5"
              >
                <span>BOT Chain Explorer</span>
                <span className="text-[11px] text-emerald-400">↗</span>
              </a>
            </div>
          </div>

          {/* Bottom Copyright & Links */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-charcoal-850 text-charcoal-500">
            <p>© {new Date().getFullYear()} FoundIt — Built natively on BOT Chain (Chain ID: 677).</p>
            <div className="flex items-center gap-4 text-charcoal-400">
              <a
                href={`https://scan.botchain.ai/address/${CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-purple-300 transition-colors"
              >
                Verified Contract: {CONTRACT_ADDRESS.slice(0, 6)}...{CONTRACT_ADDRESS.slice(-4)}
              </a>
              <span>•</span>
              <a
                href="https://scan.botchain.ai"
                target="_blank"
                rel="noreferrer"
                className="hover:text-purple-300 transition-colors"
              >
                Explorer
              </a>
              <span>•</span>
              <a
                href="https://botchain.ai"
                target="_blank"
                rel="noreferrer"
                className="hover:text-purple-300 transition-colors"
              >
                botchain.ai
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

