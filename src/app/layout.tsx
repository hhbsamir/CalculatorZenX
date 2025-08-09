import type {Metadata} from 'next';
import './globals.css';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'CalcuZen - The Ultimate Calculator',
  description: 'A versatile and beautifully designed calculator for all your needs, from simple arithmetic to complex financial planning.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"></link>
      </head>
      <body className="font-body antialiased">
        <SidebarProvider defaultOpen={false}>
            <AppSidebar />
            <SidebarInset>
              <main className="min-h-screen flex items-center justify-center p-4 relative">
                <div className="absolute top-4 left-4 z-20 md:hidden">
                  <SidebarTrigger />
                </div>
                <div className="absolute top-4 left-4 hidden md:block">
                  <SidebarTrigger />
                </div>
                {children}
              </main>
            </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
