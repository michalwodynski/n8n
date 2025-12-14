"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function AuthStatus() {
  const { data: session } = useSession();

  console.log(session?.user);

  const user = session?.user;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <div className="flex z-10 items-center gap-4 p-3.5 border border-t-gray-200 border-gray-100 bg-white rounded-2xl shadow-md w-fit absolute top-2 right-2">
      <Avatar className="w-12 h-12">
        <AvatarImage src={user?.image ?? ""} />
        <AvatarFallback className="border border-gray-300">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col leading-tight">
        <span className="font-semibold text-lg">
          {user?.name ?? "Nie zalogowano"}
        </span>
      </div>

      <Button
        onClick={() => (user ? signOut() : signIn())}
        className="ml-4 px-6 py-3 rounded-xl text-white bg-black hover:bg-gray-800 text-base"
      >
        {user ? "Wyloguj" : "Zaloguj"}
      </Button>
    </div>
  );
}
