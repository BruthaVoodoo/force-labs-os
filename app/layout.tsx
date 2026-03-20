import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AppProvider } from "@/contexts/app-context";
import { AgentsProvider } from "@/contexts/agents-context";
import { CronsProvider } from "@/contexts/crons-context";
import { LabsProvider } from "@/contexts/labs-context";
import "@/styles/globals.css";

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-orbitron',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Force Labs Control Center",
  description: "macOS-inspired control system for agent orchestration and monitoring",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${orbitron.variable} ${orbitron.className}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppProvider>
            <AgentsProvider>
              <CronsProvider>
                <LabsProvider>
                  {children}
                </LabsProvider>
              </CronsProvider>
            </AgentsProvider>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
