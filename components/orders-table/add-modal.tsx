"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  Modal,
  ModalOverlay,
} from "../application/modals/modal";
import { Plus, X } from "@untitledui/icons";
import { Button } from "../base/buttons/button";
import { Heading } from "react-aria-components";
import { Input } from "../base/input/input";
import { Select } from "../base/select/select";
import { OrderStatus } from "@/lib/orders-types";
import { useRouter } from "next/navigation";

type StatusOption = {
  label: string;
  id: OrderStatus;
};

const statusOptions: StatusOption[] = [
  { label: "Nowe", id: "new" },
  { label: "Przygotowanie", id: "processing" },
  { label: "Wysłane", id: "shipped" },
  { label: "Dostarczone", id: "delivered" },
  { label: "Anulowane", id: "cancelled" },
];

type FieldErrors = Record<string, string>;

const AddOrderModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    customerName: "",
    orderNumber: "",
    status: "new" as OrderStatus,
    totalGross: "",
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setFieldErrors({});

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer: formData.customerName,
        orderNumber: formData.orderNumber,
        status: formData.status,
        totalGross: parseFloat(formData.totalGross),
        dueDate: new Date().toISOString().slice(0, 10),
      }),
    });

    if (res.ok) {
      setIsOpen(false);
      router.refresh();
      setFormData({
        customerName: "",
        orderNumber: "",
        status: "new",
        totalGross: "",
      });
    } else if (res.status === 422) {
      const data = await res.json();
      if (data.fieldErrors) {
        const errors: FieldErrors = {};
        for (const err of data.fieldErrors) {
          errors[err.field] = err.message;
        }
        setFieldErrors(errors);
        console.log(errors);
      }
    }
  };

  return (
    <>
      <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
        <Button color="primary" size="lg" iconLeading={<Plus data-icon />}>
          Dodaj Zamówienie
        </Button>
        <ModalOverlay>
          <Modal>
            <Dialog>
              <div className="w-full max-w-lg rounded-xl bg-primary shadow-xl p-6">
                <div className="flex items-center justify-end">
                  <Button
                    slot="close"
                    color="tertiary"
                    size="lg"
                    className="p-1 -mr-1"
                    aria-label="Zamknij"
                  >
                    <X className="size-8 text-gray-400" />
                  </Button>
                </div>

                <div className="flex flex-col gap-4">
                  <Heading slot="title" className="text-md font-semibold">
                    Dodaj Zamówienie
                  </Heading>

                  <form
                    onSubmit={handleSubmit}
                    className="grid md:grid-cols-2 gap-4"
                    noValidate
                  >
                    <div className="col-span-full">
                      <Input
                        label="Nazwa klienta"
                        type="text"
                        placeholder="Podaj nazwę klienta"
                        value={formData.customerName}
                        onChange={(value) =>
                          updateFormData("customerName", value)
                        }
                        isRequired
                        hint={fieldErrors.customer}
                        isInvalid={!!fieldErrors.customer}
                      />
                    </div>

                    <div>
                      <Input
                        label="Numer zamówienia"
                        type="text"
                        placeholder="Podaj numer"
                        minLength={6}
                        value={formData.orderNumber}
                        onChange={(value) =>
                          updateFormData("orderNumber", value)
                        }
                        isRequired
                        hint={fieldErrors.orderNumber}
                        isInvalid={!!fieldErrors.orderNumber}
                      />
                    </div>

                    <div className="w-[128px]">
                      <Select
                        label="Status"
                        items={statusOptions}
                        selectedKey={formData.status}
                        onSelectionChange={(key) =>
                          updateFormData("status", key as string)
                        }
                      >
                        {(item) => (
                          <Select.Item id={item.id}>{item.label}</Select.Item>
                        )}
                      </Select>
                    </div>

                    <div className="col-span-full">
                      <Input
                        label="Kwota"
                        type="number"
                        placeholder="Podaj kwotę brutto zamówienia"
                        value={formData.totalGross}
                        onChange={(value) =>
                          updateFormData("totalGross", value)
                        }
                        isRequired
                        hint={fieldErrors.totalGross}
                        isInvalid={!!fieldErrors.totalGross}
                      />
                    </div>
                  </form>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 mt-8">
                  <Button slot="close" color="secondary" size="lg">
                    Anuluj
                  </Button>
                  <Button
                    color="primary"
                    size="lg"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    Dodaj zamówienie
                  </Button>
                </div>
              </div>
            </Dialog>
          </Modal>
        </ModalOverlay>
      </DialogTrigger>
    </>
  );
};

export default AddOrderModal;
