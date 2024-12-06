import type { Metadata } from "next"
import "./globals.css"
import { Home } from "../components/Home"

export const metadata: Metadata = {
  title: "Online Store with Next.js",
  description: "for technical test at Code PRO",
}

export default function RootLayout() {
  return (
    <html lang="en">
      <body>
        <Home />
      </body>
    </html>
  )
}
