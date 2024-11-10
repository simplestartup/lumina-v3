"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);

    // Add your login logic here

    setIsLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input type="email" placeholder="name@example.com" disabled={isLoading} />
      <Input type="password" placeholder="Password" disabled={isLoading} />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Loading..." : "Sign In"}
      </Button>
    </form>
  );
}
