import { cn } from "@/utils"
import type { Metadata } from "next"
import localFont from "next/font/local"
import { Providers } from "../components/providers"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"

const vksans = localFont({
  src: [
    {
      path: "./fonts/vk-sans-display-regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/vk-sans-display-demibold.ttf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-vk-sans",
  display: "swap",
})

const coolvetica = localFont({
  display: "swap",
  variable: "--font-coolvetica",
  src: "./fonts/coolvetica.otf",
})

export const metadata: Metadata = {
  title: {
    default: "MATTHEW MASLOV",
    template: "%s | MATTHEW MASLOV",
  },
  metadataBase: new URL("https://matthewmaslov.com"),
  description: "Мы делаем историю, всё только начинается 🧈",
  keywords: [
    "matthewmaslov",
    "matthew maslov",
    "matthew maslov portfolio",
    "matthew maslov website",
    "matthew maslov blog",
    "matthew maslov portfolio website",
    "matthew maslov portfolio website 2024",
    "matthew maslov portfolio website 2024",
  ],
  authors: [
    {
      name: "ML AGENCY",
      url: "https://t.me/ml_agency_com",
    },
    {
      name: "Matthew Maslov",
      url: "https://t.me/matthewmaslov",
    },
  ],
  creator: "ML AGENCY",
  openGraph: {
    title: "MATTHEW MASLOV",
    description: "Мы делаем историю, всё только начинается 🧈",
    url: "https://matthewmaslov.com",
    siteName: "MATTHEW MASLOV",
    locale: "ru",
    type: "website",
    images: [
      {
        url: "/opengraph.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ru"
      className={cn(vksans.variable, coolvetica.variable)}
      suppressHydrationWarning
    >
      <body
        className="font-sans text-white bg-background-200 antialiased selection:bg-white selection:text-background-200"
        style={{ scrollBehavior: "smooth" }}
      >
        <Providers>
          <Navbar />
          {children}
          <Footer />
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  )
}
