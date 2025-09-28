import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/lib/orders-types";

export const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case "new":
      return (
        <Badge color="brand" className="flex items-center gap-1">
          <div className="size-2 bg-brand-500 rounded-full block" /> Nowe
        </Badge>
      );
    case "processing":
      return (
        <Badge color="brand" className="flex items-center gap-1">
          <div className="size-2 bg-brand-500 rounded-full block" />{" "}
          Przygotowanie
        </Badge>
      );
    case "shipped":
      return (
        <Badge color="success" className="flex items-center gap-1">
          <div className="size-2 bg-success-500 rounded-full block" /> Wysłane
        </Badge>
      );
    case "delivered":
      return (
        <Badge color="success" className="flex items-center gap-1">
          <div className="size-2 bg-success-500 rounded-full block" />{" "}
          Dostarczone
        </Badge>
      );
    case "cancelled":
      return (
        <Badge color="error" className="flex items-center gap-1">
          <div className="size-2 bg-error-500 rounded-full block" /> Anulowane
        </Badge>
      );
    default:
      return (
        <Badge color="secondary" className="flex items-center gap-1">
          <div className="size-2 bg-secondary-500 rounded-full block" />{" "}
          {status}
        </Badge>
      );
  }
};
