import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

import "./globals.css"; 
import { Providers } from "./providers";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Eventra | Ticketing Made Simple",
  description: "High-concurrency event ticketing platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <body className={cn(geist.className, "min-h-screen bg-background text-foreground antialiased")}>
         <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}