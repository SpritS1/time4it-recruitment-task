"use client";

import React from "react";
import { Dialog, Modal, ModalOverlay } from "../application/modals/modal";
import { Button } from "../base/buttons/button";
import { Heading } from "react-aria-components";
import { X } from "@untitledui/icons";
import { Trash01 } from "@untitledui/icons";
import { Order } from "@/lib/orders-types";

interface DeleteModalProps {
  order: Order | null;
  onDelete?: (orderId: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const DeleteModal = ({
  order,
  onDelete,
  isOpen,
  setIsOpen,
}: DeleteModalProps) => {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (!order || !onDelete) return;

    setIsDeleting(true);
    try {
      onDelete(order.id);
      setIsOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  // Don't render if no order is selected
  if (!order) return null;

  return (
    <>
      {isOpen && (
        <ModalOverlay isOpen={isOpen} onOpenChange={setIsOpen}>
          <Modal>
            <Dialog>
              <div className="w-full max-w-md rounded-xl bg-primary shadow-xl flex flex-col gap-8 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                    <Trash01 className="size-5 text-red-600" />
                  </div>

                  <Button
                    color="tertiary"
                    size="lg"
                    className="p-1 -mr-1"
                    onClick={() => setIsOpen(false)}
                    aria-label="Zamknij"
                  >
                    <X className="size-8 text-gray-400" />
                  </Button>
                </div>

                <div className=" flex flex-col gap-1">
                  <Heading slot="title" className="text-md font-semibold">
                    Usuń zamówienie
                  </Heading>
                  <p className="text-sm text-gray-600">
                    Czy jesteś pewny, że chcesz usunąć zamówienie?
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <Button
                    color="secondary"
                    size="lg"
                    onClick={() => setIsOpen(false)}
                    isDisabled={isDeleting}
                  >
                    Anuluj
                  </Button>
                  <Button
                    color="primary-destructive"
                    size="lg"
                    onClick={handleDelete}
                    isDisabled={isDeleting}
                  >
                    {isDeleting ? "Usuwanie..." : "Usuń"}
                  </Button>
                </div>
              </div>
            </Dialog>
          </Modal>
        </ModalOverlay>
      )}
    </>
  );
};

export default DeleteModal;
