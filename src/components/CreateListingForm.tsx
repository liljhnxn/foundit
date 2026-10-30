"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ListingType } from "@/types";
import { FOUND_IT_ABI, CONTRACT_ADDRESS } from "@/contracts/foundItAbi";
import { PlusCircle, ShieldAlert, Sparkles, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

interface CreateListingFormProps {
  onSuccess?: () => void;
}

export function CreateListingForm({ onSuccess }: CreateListingFormProps) {
  const { isConnected } = useAccount();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [listingType, setListingType] = useState<ListingType>(ListingType.Lost);
  const [validationError, setValidationError] = useState<string | null>(null);

  const {
    data: hash,
    error: writeError,
    isPending: isWritePending,
    writeContractAsync,
    reset: resetWrite,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const isSubmitting = isWritePending || isConfirming;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!name.trim()) {
      setValidationError("Please enter an item name.");
      return;
    }
    if (!description.trim()) {
      setValidationError("Please provide a short description.");
      return;
    }
    if (!location.trim()) {
      setValidationError("Please enter a general location.");
      return;
    }

    try {
      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: FOUND_IT_ABI,
        functionName: "createListing",
        args: [name.trim(), description.trim(), location.trim(), Number(listingType)],
      });

      // Clear form inputs
      setName("");
      setDescription("");
      setLocation("");
      setListingType(ListingType.Lost);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error("Contract write error:", err);
    }
  };

  return (
    <div className="rounded-2xl bg-charcoal-900 border border-charcoal-800 p-6 md:p-8 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-dim/40 border border-purple-500/20 text-purple-light">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white tracking-tight">
              Publish a Listing
            </h2>
            <p className="text-xs text-charcoal-400">
              Create a record on the Botchain blockchain for a lost or found item.
            </p>
          </div>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="mb-6 rounded-xl bg-charcoal-850 border border-charcoal-700/60 p-3.5 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-purple-soft shrink-0 mt-0.5" />
        <div className="text-xs text-charcoal-300 leading-relaxed">
          <span className="font-semibold text-charcoal-200">Public Safety Notice:</span>{" "}
          All listings are permanently stored on-chain. Please provide general public locations
          (e.g., &ldquo;Campus Library, 2nd floor&rdquo;) rather than exact personal addresses or phone numbers.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Listing Type Toggle */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-400 mb-2">
            Listing Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setListingType(ListingType.Lost)}
              className={`py-3 px-4 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                listingType === ListingType.Lost
                  ? "bg-purple-dim/70 border-purple-500/60 text-purple-200 shadow-glow-purple"
                  : "bg-charcoal-850 border-charcoal-800 text-charcoal-400 hover:text-charcoal-200 hover:border-charcoal-700"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${listingType === ListingType.Lost ? "bg-purple-400" : "bg-charcoal-600"}`} />
              Lost Item
            </button>
            <button
              type="button"
              onClick={() => setListingType(ListingType.Found)}
              className={`py-3 px-4 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                listingType === ListingType.Found
                  ? "bg-emerald-dim/70 border-emerald-500/60 text-emerald-200 shadow-glow-emerald"
                  : "bg-charcoal-850 border-charcoal-800 text-charcoal-400 hover:text-charcoal-200 hover:border-charcoal-700"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${listingType === ListingType.Found ? "bg-emerald-400" : "bg-charcoal-600"}`} />
              Found Item
            </button>
          </div>
        </div>

        {/* Item Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-400 mb-2">
            Item Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Navy Blue Backpack, Matte Black AirPods..."
            className="w-full px-4 py-3 rounded-xl bg-charcoal-850 border border-charcoal-800 text-white placeholder-charcoal-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors text-sm"
            disabled={isSubmitting}
          />
        </div>

        {/* Location Input */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-400 mb-2">
            General Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Central Library, 2nd Floor Study Area"
            className="w-full px-4 py-3 rounded-xl bg-charcoal-850 border border-charcoal-800 text-white placeholder-charcoal-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors text-sm"
            disabled={isSubmitting}
          />
        </div>

        {/* Description Textarea */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-400 mb-2">
            Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide distinctive features, brand, color, or condition to identify the item..."
            className="w-full px-4 py-3 rounded-xl bg-charcoal-850 border border-charcoal-800 text-white placeholder-charcoal-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors text-sm resize-none"
            disabled={isSubmitting}
          />
        </div>

        {/* Validation Error Message */}
        {validationError && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Transaction Error Message */}
        {(writeError || confirmError) && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="break-all">
              {writeError?.message || confirmError?.message || "Transaction failed. Please try again."}
            </span>
          </div>
        )}

        {/* Transaction Success Message */}
        {isConfirmed && (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Listing published successfully on Botchain!</span>
            </div>
            <button
              type="button"
              onClick={() => resetWrite()}
              className="text-xs underline text-emerald-400 hover:text-emerald-300"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={!isConnected || isSubmitting}
            className="w-full py-3.5 px-6 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-purple-brand to-purple-muted hover:from-purple-light hover:to-purple-brand disabled:opacity-50 disabled:cursor-not-allowed shadow-card hover:shadow-glow-purple transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>
                  {isConfirming ? "Confirming on Botchain..." : "Awaiting signature..."}
                </span>
              </>
            ) : !isConnected ? (
              <>
                <span>Connect MetaMask to Publish</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Publish Listing to Blockchain</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

