import "./globals.css";
import { Header } from "@/components/Header";
import ThemeSwitch from "@/components/ThemeSwitch";

export const metadata = { title: "XMarket", description: "Marketplace C2C" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="dark:[color-scheme:dark]">
      <body>
        <Header />
        <main className="container py-6">{children}</main>
        <div className="fixed bottom-4 right-4"><ThemeSwitch /></div>
      </body>
    </html>
  );
}