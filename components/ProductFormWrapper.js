import { ProductForm } from "./ProductForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";

async function ProductFormWrapper() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAllowed) {
    return (
      <div className="absolute inset-0 -top-1/2 flex items-center justify-center">
        <h2 className="text-4xl font-bold mb-4 text-red-500">
          Brak dostępu. Zaloguj się.
        </h2>
      </div>
    );
  }

  return <ProductForm />;
}

export default ProductFormWrapper;
