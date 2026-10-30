export function shortenAddress(address?: string): string {
  if (!address) return "";
  if (address.length <= 10) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

export function formatTimestamp(timestamp: bigint | number): string {
  if (!timestamp) return "";
  const numericTime = typeof timestamp === "bigint" ? Number(timestamp) : timestamp;
  const date = new Date(numericTime * 1000);
  
  // Format as e.g. "Oct 30, 2026 • 2:30 PM"
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function formatTimeAgo(timestamp: bigint | number): string {
  if (!timestamp) return "";
  const numericTime = typeof timestamp === "bigint" ? Number(timestamp) : timestamp;
  const now = Math.floor(Date.now() / 1000);
  const diff = now - numericTime;

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

