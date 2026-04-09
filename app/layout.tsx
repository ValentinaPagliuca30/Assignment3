import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from "@clerk/nextjs";
import { Dancing_Script } from "next/font/google";
import "./globals.css";

const dancingScript = Dancing_Script({
  variable: "--font-cursive",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dancingScript.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          <header className="sticky top-0 z-50 border-b-4 border-[#ff69b4] bg-[#ff69b4] shadow-lg">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
              <div className="flex items-center gap-6">
                <a href="/" className="text-2xl font-black tracking-tight text-white drop-shadow">
                  Bookshelf
                </a>
                <nav className="flex gap-4 text-sm font-black text-white">
                  <a href="/" className="hover:text-pink-200 transition">
                    Home
                  </a>
                  <a href="/search" className="hover:text-pink-200 transition">
                    Search
                  </a>
                  <Show when="signed-in">
                    <a href="/my-books" className="hover:text-pink-200 transition">
                      My Books
                    </a>
                  </Show>
                </nav>
              </div>
              <div className="flex items-center gap-3">
                <Show when="signed-out">
                  <SignInButton>
                    <button className="rounded-full border-2 border-white px-4 py-1.5 text-sm font-black text-white hover:bg-white hover:text-[#ff69b4] transition">
                      Sign in
                    </button>
                  </SignInButton>
                  <SignUpButton>
                    <button className="rounded-full bg-white px-4 py-1.5 text-sm font-black text-[#ff69b4] hover:bg-pink-100 transition shadow-md">
                      Sign up
                    </button>
                  </SignUpButton>
                </Show>
                <Show when="signed-in">
                  <div className="relative">
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-lg" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>👑</span>
                    <div className="rounded-full ring-3 ring-white shadow-lg">
                      <UserButton />
                    </div>
                  </div>
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
