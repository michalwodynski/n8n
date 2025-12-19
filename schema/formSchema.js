import { z } from "zod";
import { MAX_FILE_SIZE } from "@/lib/constants";

export const productFormClientSchema = z.object({
  productName: z
    .string()
    .trim()
    .min(3, "Nazwa produktu musi mieć co najmniej 3 znaki")
    .max(100, "Nazwa produktu może mieć maksymalnie 100 znaków"),

  selectedFolder: z.string().trim().min(1, "Folder musi być wybrany"),

  productImage: z
    .any()
    .refine(
      (files) =>
        typeof FileList !== "undefined" &&
        files instanceof FileList &&
        files.length === 1,
      "Zdjęcie jest wymagane"
    )
    .refine(
      (files) => files?.[0]?.type?.startsWith("image/"),
      "Plik musi być obrazem"
    )
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Maksymalny rozmiar zdjęcia to ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    ),
});

export const productFormServerSchema = z.object({
  productName: z.string().trim().min(3).max(100),

  selectedFolder: z.string().trim().min(1),

  productImage: z
    .instanceof(File, { message: "Zdjęcie jest wymagane" })
    .refine((file) => file.size > 0, "Plik jest pusty")
    .refine((file) => file.type.startsWith("image/"), "Plik musi być obrazem")
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      `Maksymalny rozmiar zdjęcia to ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    ),
});
