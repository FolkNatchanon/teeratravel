// app/layout.tsx
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Inter, Noto_Sans_Thai } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["100", "200", "300", "400", "500", "700", "800"],
});

export const metadata = {
  title: "Teera Travel",
  description: "Snorkeling Tour Website",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={notoSansThai.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}