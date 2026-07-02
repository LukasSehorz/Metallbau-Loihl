import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Loihl Metall- und Systembau | Schweißtische aus Bayern",
  description:
    "Schweißtische und Spanntische aus bayerischer Manufaktur. Konfigurierbar, maßgefertigt, lieferbar in 2–4 Wochen. Direkt vom Inhaber.",
  keywords:
    "Schweißtische, Spanntische, Bayern, Manufaktur, Loihing, Maßanfertigung, Demmler, Siegmund",
  openGraph: {
    title: "Loihl Metall- und Systembau | Schweißtische aus Bayern",
    description:
      "Schweißtische und Spanntische aus bayerischer Manufaktur. Konfigurierbar, lieferbar in 2–4 Wochen.",
    locale: "de_DE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-carbon text-off-white font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
