"use client";

import { ApiList, Order, SortOrder } from "@/lib/orders-types";
import { useState } from "react";
import {
  ColumnDef,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import AddOrderModal from "./modals/add-order-modal";
import { formatCurrency, formatDate } from "@/lib/helpers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import React from "react";
import {
  ChevronDown,
  ChevronSelectorVertical,
  ChevronUp,
} from "@untitledui/icons";
import DeleteOrderModal from "./modals/delete-order-modal";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { getStatusBadge } from "./utils/get-status-badge";

interface OrdersTableProps {
  data: ApiList<Order>;
  sortField: string;
  sortOrder: SortOrder;
  currentPage: number;
}

const OrdersTable = ({
  data,
  sortField,
  sortOrder,
  currentPage,
}: OrdersTableProps) => {
  const router = useRouter();

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const [sorting, setSorting] = useState<SortingState>([
    { id: sortField, desc: sortOrder === "desc" },
  ]);

  const columns: ColumnDef<Order>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Zaznacz wszystko"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Zaznacz wiersz"
        />
      ),
      enableHiding: false,
    },
    {
      accessorKey: "orderNumber",
      header: ({ column }) => {
        const isSorted = sorting.find((s) => s.id === "orderNumber");
        return (
          <button
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => handleSortChange("orderNumber")}
          >
            Numer zamówienia
            {isSorted ? (
              isSorted.desc ? (
                <ChevronDown className="size-3" />
              ) : (
                <ChevronUp className="size-3" />
              )
            ) : (
              <ChevronSelectorVertical className="size-3" />
            )}
          </button>
        );
      },
      cell: ({ row }) => (
        <div className="whitespace-nowrap">
          <p className="text-sm font-medium text-gray-900">
            #{row.getValue("orderNumber")}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "dueDate",
      header: ({ column }) => {
        const isSorted = sorting.find((s) => s.id === "dueDate");
        return (
          <button
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => handleSortChange("dueDate")}
          >
            Data
            {isSorted ? (
              isSorted.desc ? (
                <ChevronDown className="size-3" />
              ) : (
                <ChevronUp className="size-3" />
              )
            ) : (
              <ChevronSelectorVertical className="size-3" />
            )}
          </button>
        );
      },
      cell: ({ row }) => <div>{formatDate(row.getValue("dueDate"))}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <div>{getStatusBadge(row.getValue("status"))}</div>,
    },
    {
      accessorKey: "totalGross",
      header: ({ column }) => {
        const isSorted = sorting.find((s) => s.id === "totalGross");
        return (
          <button
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => handleSortChange("totalGross")}
          >
            Kwota
            {isSorted ? (
              isSorted.desc ? (
                <ChevronDown className="size-3" />
              ) : (
                <ChevronUp className="size-3" />
              )
            ) : (
              <ChevronSelectorVertical className="size-3" />
            )}
          </button>
        );
      },
      cell: ({ row }) => (
        <div className="whitespace-nowrap">
          {formatCurrency(row.getValue("totalGross"))}
        </div>
      ),
    },
    {
      accessorKey: "customer",
      header: "Klient",
      cell: ({ row }) => (
        <div className="whitespace-nowrap">
          <p className="text-sm font-medium text-gray-900">
            {row.getValue("customer")}
          </p>
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return <DeleteOrderModal orderId={row.original.id} />;
      },
    },
  ];

  const handleSortChange = (field: string) => {
    const currentSort = sorting.find((s) => s.id === field);
    const desc = currentSort ? !currentSort.desc : false;

    const newSorting = [{ id: field, desc }];
    setSorting(newSorting);

    router.push(
      `/?page=${currentPage}&sortField=${field}&sortOrder=${
        desc ? "desc" : "asc"
      }`,
      { scroll: false }
    );
  };

  const table = useReactTable({
    data: data.items,
    columns,
    manualPagination: true,
    pageCount: Math.ceil(data.total / data.perPage),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualSorting: true,
    state: {
      pagination: { pageIndex: data.page, pageSize: data.perPage },
      columnVisibility,
      rowSelection,
      sorting,
    },
  });

  const handlePageChange = (newPage: number) => {
    router.push(
      `/?page=${newPage}&sortField=${sorting[0]?.id}&sortOrder=${
        sorting[0]?.desc ? "desc" : "asc"
      }`,
      {
        scroll: false,
      }
    );
  };

  return (
    <div className="rounded-xl border-secondary border w-full">
      <div className="text-sm bg-secondary text-primary rounded-t-xl font-semibold px-5 pt-3 pb-2 ">
        Zamówienia
      </div>
      <div>
        <div className="bg-white p-5 rounded-t-xl border-t flex flex-col gap-5 relative">
          <div className="absolute inset-0 bg-secondary translate-y-[-2px] -z-10" />
          <div className="flex flex-col sm:flex-row gap-5 sm:items-center justify-between">
            <div className="flex flex-col">
              <p className="text-display-sm font-semibold">{data.total}</p>
              <p className="text-sm font-medium text-gray-600">
                Wszystkich zamówień
              </p>
            </div>

            <AddOrderModal />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="ml-auto w-full sm:w-fit flex items-center"
              >
                Konfiguruj widok{" "}
                <ChevronDown className="size-5 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Table aria-label="Zamówienia">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Brak wyników.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between space-x-2 px-6 py-4 border-t">
          <span className="text-sm font-medium text-gray-700">
            Strona {table.getState().pagination.pageIndex} z{" "}
            {table.getPageCount()}
          </span>

          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handlePageChange(table.getState().pagination.pageIndex - 1)
              }
              disabled={table.getState().pagination.pageIndex <= 1}
              aria-label="Poprzednia strona"
            >
              Poprzednia
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handlePageChange(table.getState().pagination.pageIndex + 1)
              }
              disabled={
                table.getState().pagination.pageIndex >= table.getPageCount()
              }
              aria-label="Następna strona"
            >
              Następna
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersTable;
