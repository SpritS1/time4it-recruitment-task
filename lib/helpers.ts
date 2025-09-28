export const formatCurrency = (amount: number) => {
  return `$${amount % 1 === 0 ? amount : amount.toFixed(2)}`;
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
