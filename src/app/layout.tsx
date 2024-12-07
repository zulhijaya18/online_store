import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Online Store with Next.js",
  description: "for technical test at Code PRO",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
