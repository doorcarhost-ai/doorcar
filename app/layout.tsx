import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { ToastContainer } from "@/components/shared/Toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DoorCar — Drive Your Way",
    template: "%s | DoorCar",
  },
  description:
    "India's premium self-drive car rental platform. Book top-rated cars for hourly, daily or weekly rentals across 50+ cities.",
  keywords: [
    "self drive car rental",
    "car rental India",
    "hourly car rental",
    "DoorCar",
    "Bangalore car rental",
  ],
  openGraph: {
    title: "DoorCar — Drive Your Way",
    description:
      "India's premium self-drive car rental platform. Book top-rated cars for hourly, daily or weekly rentals.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}
