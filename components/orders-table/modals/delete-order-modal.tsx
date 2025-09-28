"use client";

import React from "react";
import { Trash01 } from "@untitledui/icons";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { deleteOrder } from "@/lib/data/orders";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DeleteModalProps {
  orderId: string;
}

const DeleteOrderModal = ({ orderId }: DeleteModalProps) => {
  const router = useRouter();

  const [isPending, setIsPending] = React.useState(false);

  const handleDeleteOrder = async (orderId: string) => {
    try {
      setIsPending(true);
      await deleteOrder(orderId);
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Błąd podczas usuwania zamówienia");
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Otwórz menu</span>
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DialogTrigger asChild>
              <DropdownMenuItem>
                <Trash01 className="text-red-500" />{" "}
                <span className="text-sm text-semibold">Usuń zamówienie</span>
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Usuń zamówienie</DialogTitle>
            <DialogDescription>
              Czy jesteś pewny, że chcesz usunąć zamówienie?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="md:col-span-2 mt-6 grid grid-cols-2 gap-2 items-start">
            <DialogClose asChild>
              <Button variant="outline">Anuluj</Button>
            </DialogClose>
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={() => handleDeleteOrder(orderId)}
            >
              Usuń
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteOrderModal;
