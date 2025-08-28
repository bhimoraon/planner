import type React from "react"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import { Geist_Mono } from "next/font/google"
// npm install geist

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})


import "./globals.css"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "sonner"
import Link from "next/link"

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Personal Productivity Planner",
  description: "A professional productivity planner to help you stay organized and focused.",
  generator: "Next.js",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${dmSans.variable} ${geistMono.variable} font-mono`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1">
            <header className="flex items-center justify-between px-6 py-4 border-b border-sidebar-border bg-card/50 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="focus-enhanced" />
                <div className="flex items-center gap-2">
                  <Link
                    href="/dashboard"
                    className="text-lg font-semibold text-foreground hover:text-accent transition-colors duration-200 focus-enhanced rounded-sm px-1"
                  >
                    Personal Productivity Planner
                  </Link>
                </div>
              </div>
            </header>
            <div className="flex-1 bg-background/95">{children}</div>
          </main>
        </SidebarProvider>
        <Toaster
          richColors
          position="top-right"
          toastOptions={{
            className: "card-enhanced",
          }}
        />
      </body>
    </html>
  )
}
