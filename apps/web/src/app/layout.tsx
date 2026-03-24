import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Onestop Analysis",
  description: "Teacher-facing mock exam analysis workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
