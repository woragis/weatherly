import type { Metadata } from "next";
import { DM_Sans, Outfit } from "next/font/google";
import { SettingsProvider } from "@/lib/settings";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Weatherly — clima com clareza",
  description:
    "App de clima para portfólio: previsão atual, horária e diária via OpenWeatherMap.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${dmSans.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full font-[family-name:var(--font-sans)]">
        <SettingsProvider>{children}</SettingsProvider>
      </body>
    </html>
  );
}
