"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Listing, ListingType } from "@/types";
import { shortenAddress, formatTimestamp, formatTimeAgo } from "@/utils/format";
import { FOUND_IT_ABI, CONTRACT_ADDRESS } from "@/contracts/foundItAbi";
import {
  MapPin,
  Clock,
  User,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Loader2,
  HelpCircle,
  Search,
} from "lucide-react";

interface ListingCardProps {
  listing: Listing;
  onActionComplete?: () => void;
}

export function ListingCard({ listing, onActionComplete }: ListingCardProps) {
  const { address } = useAccount();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isOwner =
    address && listing.poster.toLowerCase() === address.toLowerCase();

  const isLost = Number(listing.listingType) === ListingType.Lost;

  // Resolve Contract Write Hook
  const {
    writeContractAsync: writeResolve,
    isPending: isResolvePending,
    data: resolveHash,
  } = useWriteContract();

  const { isLoading: isResolveConfirming } = useWaitForTransactionReceipt({
    hash: resolveHash,
  });

  // Delete Contract Write Hook
  const {
    writeContractAsync: writeDelete,
    isPending: isDeletePending,
    data: deleteHash,
  } = useWriteContract();

  const { isLoading: isDeleteConfirming } = useWaitForTransactionReceipt({
    hash: deleteHash,
  });

  const isResolving = isResolvePending || isResolveConfirming;
  const isDeleting = isDeletePending || isDeleteConfirming;

  const handleResolve = async () => {
    try {
      await writeResolve({
        address: CONTRACT_ADDRESS,
        abi: FOUND_IT_ABI,
        functionName: "resolveListing",
        args: [listing.id],
      });
      if (onActionComplete) onActionComplete();
    } catch (err) {
      console.error("Failed to resolve listing:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await writeDelete({
        address: CONTRACT_ADDRESS,
        abi: FOUND_IT_ABI,
        functionName: "deleteListing",
        args: [listing.id],
      });
      setConfirmDelete(false);
      if (onActionComplete) onActionComplete();
    } catch (err) {
      console.error("Failed to delete listing:", err);
    }
  };

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl p-6 transition-all duration-200 border bg-charcoal-900 shadow-card hover:translate-y-[-2px] ${
        listing.isResolved
          ? "border-charcoal-800/80 opacity-75 hover:opacity-100"
          : isLost
          ? "border-charcoal-800 hover:border-purple-500/40 hover:shadow-glow-purple"
          : "border-charcoal-800 hover:border-emerald-500/40 hover:shadow-glow-emerald"
      }`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${
                isLost
                  ? "bg-purple-dim/70 text-purple-soft border-purple-500/30"
                  : "bg-emerald-dim/70 text-emerald-soft border-emerald-500/30"
              }`}
            >
              {isLost ? (
                <>
                  <HelpCircle className="w-3 h-3" />
                  Lost
                </>
              ) : (
                <>
                  <Search className="w-3 h-3" />
                  Found
                </>
              )}
            </span>

            {listing.isResolved && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-charcoal-800 text-emerald-light border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" />
                Resolved
              </span>
            )}
            {!listing.isResolved && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-charcoal-850 text-charcoal-400 border border-charcoal-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active
              </span>
            )}
          </div>

          <span
            className="text-xs text-charcoal-400 font-mono"
            title={formatTimestamp(listing.timestamp)}
          >
            {formatTimeAgo(listing.timestamp)}
          </span>
        </div>

        {/* Item Title */}
        <h3 className="text-lg font-bold text-white tracking-tight mb-2 group-hover:text-purple-200 transition-colors">
          {listing.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-charcoal-300 leading-relaxed mb-4 line-clamp-3">
          {listing.description}
        </p>

        {/* Location */}
        <div className="flex items-center gap-2 text-xs text-charcoal-400 mb-3 bg-charcoal-850/80 p-2.5 rounded-xl border border-charcoal-800">
          <MapPin className="w-4 h-4 text-purple-light shrink-0" />
          <span className="truncate">{listing.location}</span>
        </div>
      </div>

      {/* Footer Info & Poster */}
      <div className="mt-4 pt-4 border-t border-charcoal-800/80">
        <div className="flex items-center justify-between text-xs text-charcoal-400 mb-3">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-charcoal-400" />
            <span className="font-mono text-charcoal-300">
              {shortenAddress(listing.poster)}
            </span>
            {isOwner && (
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-purple-900/60 text-purple-300 border border-purple-700/50">
                You
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-charcoal-400">
            <Clock className="w-3 h-3" />
            <span>{formatTimestamp(listing.timestamp)}</span>
          </div>
        </div>

        {/* Owner Action Buttons */}
        {isOwner && (
          <div className="pt-2 flex items-center gap-2">
            {!listing.isResolved && (
              <button
                onClick={handleResolve}
                disabled={isResolving || isDeleting}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 hover:border-emerald-500/60 text-xs font-medium flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
              >
                {isResolving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )}
                <span>Mark as Resolved</span>
              </button>
            )}

            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                disabled={isResolving || isDeleting}
                title="Delete listing"
                className="p-2 rounded-xl bg-charcoal-850 hover:bg-rose-950/40 text-charcoal-400 hover:text-rose-400 border border-charcoal-700/70 hover:border-rose-800/50 transition-all text-xs flex items-center justify-center"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="flex items-center gap-1.5 bg-rose-950/60 p-1 rounded-xl border border-rose-800/60">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-medium flex items-center gap-1"
                >
                  {isDeleting ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <AlertTriangle className="w-3 h-3" />
                  )}
                  Confirm Delete
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  disabled={isDeleting}
                  className="px-2 py-1 text-charcoal-400 hover:text-white text-[11px]"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

