import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';
import { DebugProvider } from '@/lib/debug-context';
import { DebugConsole } from '@/components/debug-console';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Temperature Monitor',
  description: 'Monitor temperature readings from API',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} theme-transition`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <DebugProvider>
            <ThemeToggle />
            {children}
            <Toaster />
            <DebugConsole />
          </DebugProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}