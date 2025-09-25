"use client";

import { ApiList, Order, OrderStatus } from "@/lib/orders-types";
import { BadgeWithDot } from "../base/badges/badges";
import { Table, TableCard } from "../application/table/table";
import { Trash04 } from "@untitledui/icons";
import { useMemo, useState } from "react";
import { SortDescriptor } from "react-aria-components";
import { Dropdown } from "../base/dropdown/dropdown";
import { PaginationCardMinimal } from "../application/pagination/pagination";
import { useRouter } from "next/navigation";
import DeleteModal from "./delete-modal";

import AddOrderModal from "./add-modal";

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "new":
      return "brand" as const;
    case "processing":
      return "brand" as const;
    case "shipped":
      return "success" as const;
    case "delivered":
      return "success" as const;
    case "cancelled":
      return "error" as const;
    default:
      return "gray" as const;
  }
};

const getStatusLabel = (status: OrderStatus) => {
  switch (status) {
    case "new":
      return "Nowe";
    case "processing":
      return "Przygotowanie";
    case "shipped":
      return "Wysłane";
    case "delivered":
      return "Dostarczone";
    case "cancelled":
      return "Anulowane";
    default:
      return status;
  }
};

const formatCurrency = (amount: number) => {
  return `$${amount % 1 === 0 ? amount : amount.toFixed(2)}`;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

interface OrdersTableProps {
  data: ApiList<Order>;
}

const OrdersTable = ({ data }: OrdersTableProps) => {
  const router = useRouter();
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "status",
    direction: "ascending",
  });

  const sortedItems = useMemo(() => {
    return data.items.sort((a, b) => {
      const first = a[sortDescriptor.column as keyof typeof a];
      const second = b[sortDescriptor.column as keyof typeof b];

      if (
        (typeof first === "number" && typeof second === "number") ||
        (typeof first === "boolean" && typeof second === "boolean")
      ) {
        return sortDescriptor.direction === "descending"
          ? second - first
          : first - second;
      }

      if (typeof first === "string" && typeof second === "string") {
        let cmp = first.localeCompare(second);
        if (sortDescriptor.direction === "descending") {
          cmp *= -1;
        }
        return cmp;
      }

      return 0;
    });
  }, [sortDescriptor, data.items]);

  const handlePageChange = (newPage: number) => {
    router.push(`/?page=${newPage}`);
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete order");
      }

      router.refresh();
    } catch (error) {
      alert("Error deleting order");
    }
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrderForDelete, setSelectedOrderForDelete] =
    useState<Order | null>(null);

  return (
    <>
      <div className="bg-secondary rounded-lg border-t border-gray-200 border-x">
        <div className="text-sm text-primary font-semibold px-5 pt-3 pb-2 ">
          Zamówienia
        </div>
        <TableCard.Root>
          <TableCard.Header
            title={`${data.total}`}
            description="Wszystkich zamówień"
            contentTrailing={
              <div className="absolute top-5 right-4 md:right-6">
                <AddOrderModal />
              </div>
            }
          />
          <Table
            aria-label="Zamówienia"
            selectionMode="multiple"
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
          >
            <Table.Header>
              <Table.Head
                id="orderNumber"
                label="Numer zamówienia"
                isRowHeader
                allowsSorting
                className="w-full max-w-1/4"
              />
              <Table.Head
                id="dueDate"
                label="Data"
                allowsSorting
                className="md:hidden xl:table-cell"
              />
              <Table.Head id="status" label="Status" />
              <Table.Head id="totalGross" label="Kwota" allowsSorting />
              <Table.Head id="customer" label="Klient" />
              <Table.Head id="actions" label="" />
            </Table.Header>

            <Table.Body items={sortedItems}>
              {(order: Order) => (
                <Table.Row id={order.id}>
                  <Table.Cell>
                    <div className="whitespace-nowrap">
                      <p className="text-sm font-medium text-primary">
                        #{order.orderNumber}
                      </p>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap">
                    {formatDate(order.dueDate)}
                  </Table.Cell>
                  <Table.Cell>
                    <BadgeWithDot
                      size="sm"
                      color={getStatusColor(order.status)}
                      type="pill-color"
                    >
                      {getStatusLabel(order.status)}
                    </BadgeWithDot>
                  </Table.Cell>

                  <Table.Cell className="whitespace-nowrap">
                    <p className="text-sm font-medium">
                      {formatCurrency(order.totalGross)}
                    </p>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="whitespace-nowrap">
                      <p className="text-sm font-medium text-primary">
                        {order.customer}
                      </p>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="px-4">
                    <div className="flex justify-end gap-0.5">
                      <Dropdown.Root>
                        <Dropdown.DotsButton />

                        <Dropdown.Popover>
                          <Dropdown.Menu>
                            <Dropdown.Section>
                              <Dropdown.Item
                                icon={Trash04}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedOrderForDelete(order);
                                  setIsDeleteModalOpen(true);
                                }}
                              >
                                Usuń zamówienie
                              </Dropdown.Item>
                            </Dropdown.Section>
                          </Dropdown.Menu>
                        </Dropdown.Popover>
                      </Dropdown.Root>
                    </div>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>

          <PaginationCardMinimal
            page={data.page}
            total={data.totalPages}
            align="right"
            onPageChange={handlePageChange}
            className="px-4 py-3 md:px-6 md:pt-3 md:pb-4"
          />
        </TableCard.Root>
      </div>

      <DeleteModal
        order={selectedOrderForDelete}
        onDelete={handleDeleteOrder}
        isOpen={isDeleteModalOpen}
        setIsOpen={(open) => {
          setIsDeleteModalOpen(open);
          if (!open) {
            setSelectedOrderForDelete(null);
          }
        }}
      />
    </>
  );
};

export default OrdersTable;
