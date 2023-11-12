import { rubik } from "./fonts"
import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Afifudin | Afifcodes",
  description: "//.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={rubik.className}>{children}</body>
    </html>
  )
}
