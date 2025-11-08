import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ERPProvider } from "@/contexts/ERPContext";
import { WorkflowProvider } from "@/contexts/WorkflowContext";
// import { ToastProvider } from "@/components/ui/toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Butane Energy ERP | RC 423007",
  description: "Enterprise Resource Planning System for Butane Energy Limited - LPG Storage, Trading, and Marketing Company",
  keywords: ["ERP", "Butane Energy", "LPG", "Nigeria", "Enterprise Resource Planning", "Gas Trading"],
  authors: [{ name: "Butane Energy Limited" }],
  openGraph: {
    title: "Butane Energy ERP System",
    description: "Professional ERP System for LPG Operations",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ERPProvider>
            <WorkflowProvider>
              {/* <ToastProvider> */}
                {children}
              {/* </ToastProvider> */}
            </WorkflowProvider>
          </ERPProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
