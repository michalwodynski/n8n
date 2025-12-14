import AuthStatus from "@/components/AuthStatus";
import ProductFormWrapper from "@/components/ProductFormWrapper";

export default function Home() {
  return (
    <main className="">
      <AuthStatus />
      <ProductFormWrapper />
    </main>
  );
}
