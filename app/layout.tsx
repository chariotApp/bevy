import "./globals.css";
import Navbar from "@/components/Navigationbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Guild</title>
        <meta name="description" content="View and manage your dues and fees" />
      </head>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
