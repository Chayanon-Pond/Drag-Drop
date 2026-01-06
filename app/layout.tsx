import "./globals.css";
import Navbar from "./components/ui/navber";
import { PositionsProvider } from "./context/PositionContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body>
        <Navbar />
        <PositionsProvider>
          <main>{children}</main>
        </PositionsProvider>
      </body>
    </html>
  );
}
