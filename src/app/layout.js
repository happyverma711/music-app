import { Inter } from "next/font/google";
import "./globals.css";
import { PlayerProvider } from "@/providers/PlayerProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Arijit Music | Premium Player",
  description: "High-performance premium music streaming application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PlayerProvider>
          <div className="min-h-screen bg-[#0c0c1e] text-white">
            {children}
          </div>
        </PlayerProvider>
      </body>
    </html>
  );
}
