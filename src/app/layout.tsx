import type {Metadata} from 'next';
import './globals.css';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/use-auth';

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
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"></link>
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <SidebarProvider defaultOpen={false}>
              <AppSidebar />
              <SidebarInset>
                <div className="relative flex flex-col min-h-screen">
                  <header className="py-4 text-center">
                    <div className="text-2xl font-bold text-foreground">
                      Calculator X
                    </div>
                  </header>
                  <main className="flex-grow flex items-center justify-center p-4 relative">
                    <div className="absolute top-4 left-4 z-20 sm:hidden">
                      <SidebarTrigger />
                    </div>
                    <div className="absolute top-4 left-4 hidden sm:block">
                       <SidebarTrigger />
                    </div>
                    {children}
                  </main>
                  <footer className="py-4 text-center text-muted-foreground">
                    By Samir
                  </footer>
                </div>
              </SidebarInset>
          </SidebarProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
