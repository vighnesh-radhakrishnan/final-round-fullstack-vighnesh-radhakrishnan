export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
};
// Utilities Formatter (Date, Payment method, Intials etc)

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export const getPaymentMethodDisplay = (method: string | null): string => {
  if (!method) return "—";

  const methods: Record<string, string> = {
    card: "Card",
    ach: "ACH",
    check: "Check",
    wire: "Wire",
  };

  return methods[method] || method;
};

export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};
