import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ProjectProvider } from "./context/ProjectContext";

const nunitoSans = Nunito_Sans({
  variable: "--font-primary",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MSD Solicitord CMS",
  description: "Content Management System for MSD Solicitors",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${nunitoSans.variable} h-full`}>
      <body
        className="min-h-full bg-[#f5f8f8] text-[#182d32] antialiased"
        suppressHydrationWarning
      >
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: "Nunito Sans, sans-serif",
              fontWeight: 700,
              fontSize: "14px",
              borderRadius: "12px",
              border: "1px solid #dbe7e9",
            },
            success: { iconTheme: { primary: "#0f6b72", secondary: "#fff" } },
          }}
        />
        <ProjectProvider>{children}</ProjectProvider>
      </body>
    </html>
  );
}
