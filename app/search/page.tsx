"use client";

import { useState } from "react";
import { useUser, useSession } from "@clerk/nextjs";
import { createClerkSupabaseClient } from "@/lib/supabase";
import Image from "next/image";

interface Book {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
}

export default function SearchPage() {
  const { user } = useUser();
  const { session } = useSession();
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState<Set<string>>(new Set());

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setBooks(data.docs ?? []);
    setLoading(false);
  }

  async function saveFavorite(book: Book) {
    if (!session || !user) return;

    const supabase = createClerkSupabaseClient(() =>
      session.getToken({ template: "supabase" })
    );

    const coverUrl = book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
      : "";

    const { error } = await supabase.from("favorites").insert({
      user_id: user.id,
      title: book.title,
      author: book.author_name?.[0] ?? "Unknown",
      cover_url: coverUrl,
      ol_key: book.key,
    });

    if (error) {
      alert(`Error: ${error.message}`);
    } else {
      setSaved((prev) => new Set(prev).add(book.key));
    }
  }

  return (
    <div className="flex flex-col flex-1 items-center px-4 py-12 font-sans">
      <h1 className="text-2xl font-semibold mb-6">Search Books</h1>

      <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-md mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title..."
          className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <button
          type="submit"
          className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          Search
        </button>
      </form>

      {loading && <p className="text-zinc-500">Searching...</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-3xl">
        {books.map((book) => (
          <div
            key={book.key}
            className="flex flex-col items-center rounded-lg border border-zinc-200 p-3 dark:border-zinc-700"
          >
            {book.cover_i ? (
              <Image
                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                alt={book.title}
                width={128}
                height={192}
                className="rounded mb-2"
              />
            ) : (
              <div className="w-32 h-48 bg-zinc-200 dark:bg-zinc-800 rounded mb-2 flex items-center justify-center text-xs text-zinc-500">
                No cover
              </div>
            )}
            <p className="text-sm font-medium text-center line-clamp-2">
              {book.title}
            </p>
            <p className="text-xs text-zinc-500 text-center line-clamp-1">
              {book.author_name?.[0] ?? "Unknown"}
            </p>
            <button
              onClick={() => saveFavorite(book)}
              disabled={saved.has(book.key)}
              className="mt-2 rounded-full bg-black px-3 py-1 text-xs text-white hover:bg-zinc-800 disabled:bg-zinc-400 dark:bg-white dark:text-black dark:hover:bg-zinc-200 dark:disabled:bg-zinc-600"
            >
              {saved.has(book.key) ? "Saved!" : "Save"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
