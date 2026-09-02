import type { Metadata } from "next";
import { Inter, Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/store/StoreProvider";
import { BootGate } from "@/components/boot/BootGate";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "JARVIS",
  description: "Personal AI operating system",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${orbitron.variable} ${rajdhani.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col bg-jarvis-bg text-jarvis-fg"
        suppressHydrationWarning
      >
        <StoreProvider>
          <BootGate>{children}</BootGate>
        </StoreProvider>
      </body>
    </html>
  );
}
