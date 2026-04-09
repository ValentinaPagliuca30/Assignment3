"use client";

import { useSession } from "@clerk/nextjs";
import { createClerkSupabaseClient } from "@/lib/supabase";
import { useState, useEffect } from "react";
import Image from "next/image";

interface Favorite {
  id: number;
  user_id: string;
  title: string;
  author: string;
  cover_url: string;
  ol_key: string;
}

export default function Home() {
  const { session } = useSession();
  const [books, setBooks] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;

    async function fetchBooks() {
      const supabase = createClerkSupabaseClient(() =>
        session!.getToken({ template: "supabase" })
      );

      const { data } = await supabase
        .from("favorites")
        .select("*")
        .order("id", { ascending: false });

      setBooks(data ?? []);
      setLoading(false);
    }

    fetchBooks();
  }, [session]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-white font-black text-xl">Loading bookshelf...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 px-6 py-10">
      <div className="max-w-5xl mx-auto w-full">
        <h1 className="text-5xl font-black tracking-tight text-white drop-shadow-lg mb-1">
          Class Bookshelf
        </h1>
        <p className="text-pink-200 font-bold mb-8 text-lg">
          {books.length} {books.length === 1 ? "book" : "books"} saved by the class
        </p>

        {books.length === 0 ? (
          <p className="text-white font-bold">
            No books yet.{" "}
            <a href="/search" className="underline text-pink-100 hover:text-white">
              Search
            </a>{" "}
            to add some!
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {books.map((book) => (
              <div
                key={book.id}
                className="group flex flex-col rounded-2xl border-2 border-[#ff69b4] bg-white p-3 shadow-lg transition hover:shadow-2xl hover:scale-105 hover:border-[#ff1493]"
              >
                {book.cover_url ? (
                  <Image
                    src={book.cover_url}
                    alt={book.title}
                    width={160}
                    height={240}
                    className="w-full aspect-[2/3] object-cover rounded-xl mb-3"
                  />
                ) : (
                  <div className="w-full aspect-[2/3] bg-pink-200 rounded-xl mb-3 flex items-center justify-center text-xs text-[#ff69b4] font-black">
                    No cover
                  </div>
                )}
                <p className="text-sm font-black leading-tight line-clamp-2 text-[#c2185b]">
                  {book.title}
                </p>
                <p className="text-xs text-[#ff69b4] mt-1 line-clamp-1 font-bold">
                  {book.author}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
