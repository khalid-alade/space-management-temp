import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { siteConfig } from "@/config/site"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { AdminAuthProvider } from "@/hooks/use-admin-auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["coworking", "event space", "Nithub", "workspace", "booking", "Lagos", "tech hub"],
  authors: [
    {
      name: "Nithub",
      url: "https://nithub.com",
    },
  ],
  creator: "Nithub",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: "@nithub",
  },
  icons: {
    icon: "https://nithublms.unilag.edu.ng/pluginfile.php?file=%2F1%2Ftheme_lambda%2Ffavicon%2F1715876605%2Ffavicon-b.png",
    // shortcut: "/favicon-16x16.png",
    // apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
  generator: 'v0.dev'
}

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AdminAuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </ThemeProvider>
        </AdminAuthProvider>
      </body>
    </html>
  )
}
