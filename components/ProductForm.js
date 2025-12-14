"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { API_ENDPOINTS } from "@/lib/constants";
import { productFormClientSchema } from "@/schema/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import GoogleDrivePicker from "./GoogleDrivePicker";

const defaultValues = {
  productName: "",
  selectedFolder: "",
  productImage: undefined,
};

export function ProductForm() {
  const form = useForm({
    resolver: zodResolver(productFormClientSchema),
    defaultValues,
  });

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append("productName", data.productName.trim());
    formData.append("selectedFolder", data.selectedFolder);
    formData.append("productImage", data.productImage[0]);

    try {
      const response = await fetch(API_ENDPOINTS.N8N, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const responseData = await response.json();

      if (!response.ok) {
        toast.error(
          responseData.message || "Wystąpił błąd podczas wysyłania formularza."
        );

        if (responseData.errors) {
          console.error(
            "[ProductForm] Validation errors:",
            responseData.errors
          );
        }

        return;
      }

      toast.success(
        responseData.message ||
          "Zdjęcie produktu zostało pomyślnie wygenerowane."
      );
    } catch (error) {
      console.error("[ProductForm] Unexpected error:", error);
      toast.error(`Nie udało się połączyć z serwerem. (${error.message})`);
    }
  };

  return (
    <div className="flex justify-center items-start w-full pt-16">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="
            w-full max-w-lg bg-white 
            p-10 rounded-2xl shadow-lg space-y-6
          "
        >
          <h2 className="text-3xl font-bold mb-4">Wygeneruj Zdjęcie</h2>

          {/* Nazwa produktu */}
          <FormField
            control={form.control}
            name="productName"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-gray-700 font-medium">
                  Nazwa Produktu
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Wprowadź nazwę produktu"
                    className="
                      h-12 rounded-lg border-gray-300 
                      focus:ring-0 focus:border-black
                    "
                    disabled={form.formState.isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Wybrany Folder*/}
          <FormField
            control={form.control}
            name="selectedFolder"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-gray-700 font-medium">
                  Wybrany Folder
                </FormLabel>
                <FormControl>
                  <GoogleDrivePicker
                    disabled={form.formState.isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Zdjęcie produktu */}
          <FormField
            control={form.control}
            name="productImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Zdjęcie Produktu
                </FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => field.onChange(e.target.files)}
                    disabled={form.formState.isSubmitting}
                    className="h-12 rounded-lg border-gray-300 pt-2.5 focus:ring-0 focus:border-black cursor-pointer"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full h-12 mt-4 rounded-lg bg-black hover:bg-gray-800 cursor-pointer text-white font-semibold text-md"
          >
            {form.formState.isSubmitting ? "Wysyłanie..." : "Utwórz Zdjęcie"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
