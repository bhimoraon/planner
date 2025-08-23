import type React from "react"
import type { Metadata } from "next"


import "./globals.css"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "sonner"
import Link from "next/link"
// import { ChevronRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Personl Productivity Planner",
  description: "A personal productivity planner to help you stay organized and focused.",
  generator: "Next.js",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {



  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <style>{`

        `}</style>
      </head>
      <body>
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1">
            <header className="flex items-center justify-between p-4 border-b border-sidebar-border">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 cursor-pointer">Personal Productivity Planner</Link>
                  {/* <ChevronRight className="size-4" /> */}

                </div>
              </div>
            </header>
            <div className="flex-1">{children}</div>
          </main>
        </SidebarProvider>
        <Toaster richColors />
      </body>
    </html>
  )
}
