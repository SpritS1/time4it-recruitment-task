"use client";

import React, { useState } from "react";
import { Plus } from "@untitledui/icons";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";

import { Button } from "../../ui/button";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../../ui/form";

import { AddOrderFormValues, OrderStatus } from "@/lib/orders-types";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { addOrder } from "@/lib/data/orders";

type StatusOption = {
  label: string;
  value: OrderStatus;
};

const statusOptions: StatusOption[] = [
  { label: "Nowe", value: "new" },
  { label: "Przygotowanie", value: "processing" },
  { label: "Wysłane", value: "shipped" },
  { label: "Dostarczone", value: "delivered" },
  { label: "Anulowane", value: "cancelled" },
];

const AddOrderModal = () => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<AddOrderFormValues>({
    defaultValues: {
      customer: "",
      orderNumber: "",
      status: "new",
      totalGross: "",
      dueDate: new Date().toISOString().slice(0, 10),
    },
    mode: "onSubmit",
  });

  const onSubmit = async (data: AddOrderFormValues) => {
    const { success, fieldErrors, status } = await addOrder(data);

    if (success) {
      setIsOpen(false);
      router.refresh();
      form.reset();
    } else if (status === 422) {
      if (fieldErrors) {
        for (const error of fieldErrors) {
          form.setError(error.field as keyof AddOrderFormValues, {
            type: "server",
            message: error.message,
          });
        }
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="h-[44px]" variant="default">
          <Plus data-icon /> Dodaj Zamówienie
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>Dodaj Zamówienie</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid md:grid-cols-2 gap-4"
            noValidate
          >
            <FormField
              control={form.control}
              name="customer"
              rules={{
                required: "Nazwa klienta jest wymagana",
              }}
              render={({ field, fieldState }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Nazwa klienta</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Podaj nazwę klienta"
                      {...field}
                      aria-invalid={fieldState.invalid}
                    />
                  </FormControl>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="orderNumber"
              rules={{
                required: "Numer zamówienia jest wymagany",
              }}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Numer zamówienia</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Podaj numer"
                      {...field}
                      aria-invalid={fieldState.invalid}
                    />
                  </FormControl>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              rules={{
                required: "Status jest wymagany",
              }}
              render={({ field }) => (
                <FormItem className="w-[150px] mb-auto">
                  <FormLabel>Status</FormLabel>

                  <Select
                    aria-label="Status"
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Wybierz status" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectGroup>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="totalGross"
              rules={{
                required: "Kwota jest wymagana",
              }}
              render={({ field, fieldState }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Kwota</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Podaj kwotę brutto zamówienia"
                      {...field}
                      aria-invalid={fieldState.invalid}
                    />
                  </FormControl>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />

            <DialogFooter className="md:col-span-2 grid grid-cols-2 gap-2 items-start">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsOpen(false)}
              >
                Anuluj
              </Button>
              <Button color="primary" size="lg" type="submit">
                Dodaj zamówienie
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddOrderModal;
