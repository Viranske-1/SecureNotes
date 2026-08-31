import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SecureNotes - Encrypted Note Manager",
  description:
    "SecureNotes is a privacy-focused encrypted note management application using AES-256-GCM encryption and JWT authentication.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (

    <html
      lang="en"
      className="h-full antialiased"
    >

      <body className="min-h-full text-gray-800">

        {children}

      </body>

    </html>

  );

}
