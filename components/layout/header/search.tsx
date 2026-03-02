"use client";

import Form from "next/form";
import { useSearchParams } from "next/navigation";
import { SearchIcon } from "lucide-react";

export default function Search() {
  const searchParams = useSearchParams();

  return (
    <Form
      action="/search"
      prefetch={false}
      className="relative w-full"
    >
      <input
        key={searchParams?.get("q")}
        type="text"
        name="q"
        placeholder="Search for products..."
        autoComplete="off"
        defaultValue={searchParams?.get("q") || ""}
        className="w-full rounded-lg border bg-background/10 backdrop-blur-md px-4 py-2 pr-10 text-sm text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
      />
      <button
        type="submit"
        className="absolute right-0 top-0 h-full px-3 flex items-center text-foreground/50 hover:text-foreground transition-colors"
        aria-label="Search"
      >
        <SearchIcon className="h-4 w-4" />
      </button>
    </Form>
  );
}

export function SearchSkeleton() {
  return (
    <form className="relative w-full">
      <input
        placeholder="Search for products..."
        className="w-full rounded-lg border bg-background/10 backdrop-blur-md px-4 py-2 pr-10 text-sm text-foreground placeholder:text-foreground/50"
        disabled
      />
      <div className="absolute right-0 top-0 h-full px-3 flex items-center text-foreground/50">
        <SearchIcon className="h-4 w-4" />
      </div>
    </form>
  );
}
