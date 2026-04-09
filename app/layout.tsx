import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950">
        <ClerkProvider>
          <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
              <div className="flex items-center gap-6">
                <a href="/" className="text-lg font-bold tracking-tight">
                  Bookshelf
                </a>
                <nav className="flex gap-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  <a href="/" className="hover:text-black dark:hover:text-white transition">
                    Home
                  </a>
                  <a href="/search" className="hover:text-black dark:hover:text-white transition">
                    Search
                  </a>
                  <Show when="signed-in">
                    <a href="/my-books" className="hover:text-black dark:hover:text-white transition">
                      My Books
                    </a>
                  </Show>
                </nav>
              </div>
              <div className="flex items-center gap-3">
                <Show when="signed-out">
                  <SignInButton>
                    <button className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800 transition">
                      Sign in
                    </button>
                  </SignInButton>
                  <SignUpButton>
                    <button className="rounded-full bg-black px-4 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition">
                      Sign up
                    </button>
                  </SignUpButton>
                </Show>
                <Show when="signed-in">
                  <UserButton />
                </Show>
              </div>
            </div>
          </header>
          <main className="flex flex-col flex-1">{children}</main>
        </ClerkProvider>
      </body>
    </html>
  );
}
