"use client";
import AuthGuard from "@/app/components/AuthGuard";
import DashboardLayout from "@/app/components/layout/DashboardLayout";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/dashboard":                   "Dashboard",
  "/dashboard/projects":          "Projects",
  "/dashboard/reviews":           "Reviews",
  "/dashboard/eligibility":       "Eligibility Points",
  "/dashboard/faqs":              "FAQs",
  "/dashboard/services":          "Services",
  "/dashboard/fees":              "Fees",
  "/dashboard/process":           "Process Steps",
  "/dashboard/features":          "Why Choose Us",
  "/dashboard/team":              "Team Members",
  "/dashboard/submissions":       "Enquiries",
  "/dashboard/settings":          "Site Settings",
  "/dashboard/users":             "Users",
};

function TitledLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "Dashboard";
  return <DashboardLayout title={title}>{children}</DashboardLayout>;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <TitledLayout>{children}</TitledLayout>
    </AuthGuard>
  );
}
