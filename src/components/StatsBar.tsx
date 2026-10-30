import { ListingStats } from "@/types";
import { Package, Search, HelpCircle, CheckCircle2 } from "lucide-react";

interface StatsBarProps {
  stats: ListingStats;
  isLoading?: boolean;
}

export function StatsBar({ stats, isLoading }: StatsBarProps) {
  const items = [
    {
      label: "Total Listings",
      value: stats.total,
      icon: Package,
      accent: "text-purple-light",
      bg: "bg-purple-dim/40 border-purple-500/20",
    },
    {
      label: "Lost Items",
      value: stats.lost,
      icon: HelpCircle,
      accent: "text-purple-300",
      bg: "bg-charcoal-800/80 border-charcoal-700/60",
    },
    {
      label: "Found Items",
      value: stats.found,
      icon: Search,
      accent: "text-emerald-light",
      bg: "bg-emerald-dim/30 border-emerald-500/20",
    },
    {
      label: "Resolved",
      value: stats.resolved,
      icon: CheckCircle2,
      accent: "text-emerald-light",
      bg: "bg-emerald-dim/40 border-emerald-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="relative overflow-hidden rounded-2xl bg-charcoal-900 border border-charcoal-800 p-5 shadow-card hover:border-charcoal-700 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider font-medium text-charcoal-400">
                  {item.label}
                </p>
                <div className="mt-2 text-2xl md:text-3xl font-bold tracking-tight text-white">
                  {isLoading ? (
                    <span className="inline-block w-8 h-8 rounded-md bg-charcoal-800 animate-pulse" />
                  ) : (
                    item.value
                  )}
                </div>
              </div>
              <div className={`p-3 rounded-xl border ${item.bg}`}>
                <Icon className={`w-5 h-5 ${item.accent}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

