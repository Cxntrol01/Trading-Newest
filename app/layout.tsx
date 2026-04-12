import "./globals.css";
import WaffleMenu from "@/components/WaffleMenu";

export const metadata = {
  title: "Cxntre",
  description: "Trading intelligence platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="relative">
        {/* GLOBAL NAV — always on top */}
        <WaffleMenu />

        {/* All pages render underneath */}
        {children}
      </body>
    </html>
  );
}
