"use client";

import { useState } from "react";
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import { botchainTestnet } from "@/config/chain";
import { shortenAddress } from "@/utils/format";
import { Wallet, LogOut, AlertTriangle, CheckCircle2, Copy, Sparkles } from "lucide-react";

export function Header() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [copied, setCopied] = useState(false);

  const isWrongNetwork = isConnected && chainId !== botchainTestnet.id;

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConnect = () => {
    const metaMaskConnector = connectors.find((c) => c.id === "metaMask" || c.name.toLowerCase().includes("metamask")) || connectors[0];
    if (metaMaskConnector) {
      connect({ connector: metaMaskConnector });
    }
  };

  return (
    <header className="border-b border-charcoal-800/80 bg-charcoal-950/80 backdrop-blur-md sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo and Tagline */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-brand/20 via-purple-muted/30 to-emerald-brand/20 border border-purple-500/30 flex items-center justify-center shadow-glow-purple">
            <Sparkles className="w-5 h-5 text-purple-light" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">
                Found<span className="text-purple-light">It</span>
              </span>
              <span className="px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase rounded-full bg-charcoal-800 text-charcoal-300 border border-charcoal-700">
                Botchain Testnet
              </span>
            </div>
            <p className="text-xs text-charcoal-400 font-normal">
              Lost something? Find it here.
            </p>
          </div>
        </div>

        {/* Network & Wallet Actions */}
        <div className="flex items-center gap-3">
          {isConnected && isWrongNetwork && (
            <button
              onClick={() => switchChain({ chainId: botchainTestnet.id })}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-950/60 text-amber-300 border border-amber-700/60 hover:bg-amber-900/50 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Switch to Botchain</span>
            </button>
          )}

          {!isConnected ? (
            <button
              onClick={handleConnect}
              disabled={isPending}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-purple-brand to-purple-muted hover:from-purple-light hover:to-purple-brand text-white shadow-card hover:shadow-glow-purple transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
            >
              <Wallet className="w-4 h-4" />
              <span>{isPending ? "Connecting..." : "Connect MetaMask"}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              {/* Shortened Address & Copy */}
              <div className="flex items-center bg-charcoal-850 border border-charcoal-700/70 rounded-xl pl-3 pr-2 py-1.5 gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-mono text-charcoal-200 font-medium">
                  {shortenAddress(address)}
                </span>
                <button
                  onClick={handleCopy}
                  title="Copy address"
                  className="p-1 rounded-md text-charcoal-400 hover:text-charcoal-100 hover:bg-charcoal-700/60 transition-colors"
                >
                  {copied ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Disconnect Button */}
              <button
                onClick={() => disconnect()}
                title="Disconnect wallet"
                className="p-2 rounded-xl bg-charcoal-850 border border-charcoal-700/70 text-charcoal-400 hover:text-rose-400 hover:border-rose-900/50 hover:bg-rose-950/20 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

