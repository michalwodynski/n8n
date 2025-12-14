import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth.config";
import { productFormServerSchema } from "@/schema/formSchema";
import { createN8nJwt } from "@/lib/jwt";
import { fetchWithTimeout } from "@/lib/http";

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

export async function POST(req) {
  try {
    // 1. WALIDACJA SESJI
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Brak dostępu. Musisz być zalogowany." },
        { status: 401 }
      );
    }

    // 2. AUTORYZACJA UŻYTKOWNIKA
    if (!session.user.isAllowed) {
      return NextResponse.json(
        {
          success: false,
          message: "Nie masz uprawnień do wykonania tej operacji.",
        },
        { status: 403 }
      );
    }

    // 3. VALIDATE FORM DATA
    const formData = await req.formData();

    const data = {
      productName: formData.get("productName"),
      selectedFolder: formData.get("selectedFolder"),
      productImage: formData.get("productImage"),
    };

    const validationResult = productFormServerSchema.safeParse(data);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Dane formularza są nieprawidłowe. Sprawdź poprawność pól i spróbuj ponownie.",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // 4. PRZYGOTOWANIE PAYLOADU DLA N8N
    const n8nPayload = new FormData();
    n8nPayload.append("productName", validatedData.productName.trim());
    n8nPayload.append("selectedFolder", validatedData.selectedFolder);
    n8nPayload.append("productImage", validatedData.productImage);

    const token = createN8nJwt();

    const response = await fetchWithTimeout(N8N_WEBHOOK_URL, {
      method: "POST",
      body: n8nPayload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 5. OBSŁUGA ODPOWIEDZI N8N
    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: `Wystąpił błąd podczas komunikacji z serwisem przetwarzającym dane. ${await response.text()} (Kod błędu: ${
            response.status
          })`,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Zdjęcie zostało pomyślnie wysłane.",
    });
  } catch (error) {
    console.error("[Upload] Wystąpił nieoczekiwany błąd:", error);

    if (error.name === "AbortError") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Przekroczono czas oczekiwania na odpowiedź serwera. Spróbuj ponownie za chwilę.",
        },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Wewnętrzny błąd serwera." },
      { status: 500 }
    );
  }
}
