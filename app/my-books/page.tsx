"use client";

import { useUser, useSession } from "@clerk/nextjs";
import { createClerkSupabaseClient } from "@/lib/supabase";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface Favorite {
  id: number;
  user_id: string;
  title: string;
  author: string;
  cover_url: string;
  ol_key: string;
}

export default function MyBooksPage() {
  const { user } = useUser();
  const { session } = useSession();
  const [books, setBooks] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = useCallback(async () => {
    if (!session || !user) return;

    const supabase = createClerkSupabaseClient(() =>
      session.getToken({ template: "supabase" })
    );

    const { data } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", user.id)
      .order("id", { ascending: false });

    setBooks(data ?? []);
    setLoading(false);
  }, [session, user]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  async function removeBook(id: number) {
    if (!session) return;

    const supabase = createClerkSupabaseClient(() =>
      session.getToken({ template: "supabase" })
    );

    const { error } = await supabase.from("favorites").delete().eq("id", id);

    if (error) {
      alert(`Error: ${error.message}`);
    } else {
      setBooks((prev) => prev.filter((b) => b.id !== id));
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-zinc-500">Loading your books...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 px-6 py-10 font-sans">
      <div className="max-w-5xl mx-auto w-full">
        <h1 className="text-3xl font-bold tracking-tight mb-2">My Books</h1>
        <p className="text-zinc-500 mb-8">
          {books.length} {books.length === 1 ? "book" : "books"} in your collection
        </p>

        {books.length === 0 ? (
          <p className="text-zinc-400">
            You haven&apos;t saved any books yet.{" "}
            <a href="/search" className="underline">
              Search for some!
            </a>
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {books.map((book) => (
              <div
                key={book.id}
                className="group relative flex flex-col rounded-xl border border-zinc-200 bg-white p-3 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                {book.cover_url ? (
                  <Image
                    src={book.cover_url}
                    alt={book.title}
                    width={160}
                    height={240}
                    className="w-full aspect-[2/3] object-cover rounded-lg mb-3"
                  />
                ) : (
                  <div className="w-full aspect-[2/3] bg-zinc-100 dark:bg-zinc-800 rounded-lg mb-3 flex items-center justify-center text-xs text-zinc-400">
                    No cover
                  </div>
                )}
                <p className="text-sm font-semibold leading-tight line-clamp-2">
                  {book.title}
                </p>
                <p className="text-xs text-zinc-500 mt-1 line-clamp-1">
                  {book.author}
                </p>
                <button
                  onClick={() => removeBook(book.id)}
                  className="mt-2 rounded-full border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
