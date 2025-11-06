export const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatTime = (dateStr: string): string => {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
};

export const formatCurrency = (value: number): string =>
  `$${value.toFixed(2)}`;

export const truncateText = (text: string, max: number): string =>
  text.length > max ? `${text.slice(0, max)}...` : text;
