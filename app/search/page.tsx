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
    <div className="flex flex-col flex-1 items-center px-4 py-12">
      <h1 className="text-5xl font-black text-white drop-shadow-lg mb-6">Search Books</h1>

      <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-md mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title..."
          className="flex-1 rounded-full border-3 border-[#ff69b4] bg-white px-5 py-2.5 text-sm font-bold text-[#c2185b] placeholder:text-pink-300 focus:outline-none focus:border-[#ff1493] focus:ring-2 focus:ring-pink-300"
        />
        <button
          type="submit"
          className="rounded-full bg-[#ff69b4] px-6 py-2.5 text-sm font-black text-white hover:bg-[#ff1493] transition shadow-lg"
        >
          Search
        </button>
      </form>

      {loading && <p className="text-white font-black text-lg">Searching...</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 w-full max-w-3xl">
        {books.map((book) => (
          <div
            key={book.key}
            className="flex flex-col items-center rounded-2xl border-2 border-[#ff69b4] bg-white p-3 shadow-lg transition hover:shadow-2xl hover:scale-105 hover:border-[#ff1493]"
          >
            {book.cover_i ? (
              <Image
                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                alt={book.title}
                width={128}
                height={192}
                className="rounded-xl mb-2"
              />
            ) : (
              <div className="w-32 h-48 bg-pink-200 rounded-xl mb-2 flex items-center justify-center text-xs text-[#ff69b4] font-black">
                No cover
              </div>
            )}
            <p className="text-sm font-black text-center line-clamp-2 text-[#c2185b]">
              {book.title}
            </p>
            <p className="text-xs text-[#ff69b4] text-center line-clamp-1 font-bold">
              {book.author_name?.[0] ?? "Unknown"}
            </p>
            <button
              onClick={() => saveFavorite(book)}
              disabled={saved.has(book.key)}
              className="mt-2 rounded-full bg-[#ff69b4] px-4 py-1 text-xs font-black text-white hover:bg-[#ff1493] disabled:bg-pink-300 transition shadow-md"
            >
              {saved.has(book.key) ? "Saved!" : "Save"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
