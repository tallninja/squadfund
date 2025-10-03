import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { SquadFundLogo } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";
import { ChamaProvider } from "@/context/chama-context";
import { ChamaSwitcher } from "@/components/chama-switcher";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "SquadFund",
  description:
    "A digital table banking platform to manage multiple chamas (savings groups).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <ChamaProvider>
          <SidebarProvider>
            <Sidebar>
              <div className="flex flex-col h-full">
                <div className="p-4 flex items-center gap-2">
                  <SquadFundLogo className="w-8 h-8 text-primary" />
                  <h1 className="text-xl font-bold font-headline">SquadFund</h1>
                </div>
                <MainNav />
              </div>
            </Sidebar>
            <SidebarInset>
              <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6">
                <Button variant="ghost" size="icon" className="md:hidden">
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Toggle Sidebar</span>
                </Button>
                <div className="w-full flex-1">
                  <ChamaSwitcher />
                </div>
                <UserNav />
              </header>
              <main className="flex-1 p-4 lg:p-6">
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>
        </ChamaProvider>
        <Toaster />
      </body>
    </html>
  );
}
