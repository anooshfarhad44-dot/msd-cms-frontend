
"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import {
  Star, HelpCircle, Briefcase, DollarSign,
  ListChecks, Users, Mail, CheckSquare,
  TrendingUp, ArrowRight, Clock, Settings, Globe,
} from "lucide-react";
import Card from "@/app/components/ui/Card";
import { getAuth } from "@/app/lib/auth";
import {
  reviewsService, faqsService, homeServicesService, feesService,
  processStepsService, submissionsService,
} from "@/app/services/contentServices";
import { useProject } from "@/app/context/ProjectContext";

// Lazy load recharts — it's heavy (~500kb) and only needed on dashboard
const AreaChart     = dynamic(() => import("recharts").then(m => ({ default: m.AreaChart })),     { ssr: false });
const Area          = dynamic(() => import("recharts").then(m => ({ default: m.Area })),          { ssr: false });
const BarChart      = dynamic(() => import("recharts").then(m => ({ default: m.BarChart })),      { ssr: false });
const Bar           = dynamic(() => import("recharts").then(m => ({ default: m.Bar })),           { ssr: false });
const XAxis         = dynamic(() => import("recharts").then(m => ({ default: m.XAxis })),         { ssr: false });
const YAxis         = dynamic(() => import("recharts").then(m => ({ default: m.YAxis })),         { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then(m => ({ default: m.CartesianGrid })), { ssr: false });
const Tooltip       = dynamic(() => import("recharts").then(m => ({ default: m.Tooltip })),       { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then(m => ({ default: m.ResponsiveContainer })), { ssr: false });

// ─── Dummy chart data ──────────────────────────────────────────────────────────
const enquiryTrend = [
  { month: "Jan", enquiries: 3 },
  { month: "Feb", enquiries: 5 },
  { month: "Mar", enquiries: 4 },
  { month: "Apr", enquiries: 7 },
  { month: "May", enquiries: 6 },
  { month: "Jun", enquiries: 9 },
  { month: "Jul", enquiries: 8 },
  { month: "Aug", enquiries: 12 },
  { month: "Sep", enquiries: 10 },
  { month: "Oct", enquiries: 15 },
  { month: "Nov", enquiries: 13 },
  { month: "Dec", enquiries: 18 },
];

// ─── Custom tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#dbe7e9] rounded-xl px-3 py-2.5 shadow-lg text-xs">
      <p className="font-black text-[#062f36] mb-1">{label}</p>
      <p className="text-[#0f6b72] font-bold">{payload[0].value} {payload[0].name}</p>
    </div>
  );
};

const statusColor: Record<string, string> = {
  new:      "bg-red-50 text-red-600 border-red-200",
  read:     "bg-[#f4c400]/15 text-[#7a5f00] border-[#f4c400]/30",
  replied:  "bg-emerald-50 text-emerald-700 border-emerald-200",
  archived: "bg-slate-100 text-slate-500 border-slate-200",
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const user = getAuth().user;
  const { selectedProject } = useProject();
  const [data, setData] = useState({
    reviews: 0, faqs: 0, services: 0, fees: 0, processSteps: 0, submissions: 0,
    submissionsList: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedProject) {
        setLoading(false);
        return;
      }
      try {
        const [reviews, faqs, services, fees, processSteps, submissions] = await Promise.all([
          reviewsService.list(),
          faqsService.list(),
          homeServicesService.list(),
          feesService.list(),
          processStepsService.list(),
          submissionsService.list(),
        ]);
        setData({
          reviews: reviews.length,
          faqs: faqs.length,
          services: services.length,
          fees: fees.length,
          processSteps: processSteps.length,
          submissions: submissions.length,
          submissionsList: submissions.slice(0, 4),
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedProject]);

  const newCount = data.submissionsList.filter((s: any) => s.status === "new").length;

  const statCards = [
    { label: "New Enquiries",   value: newCount,                   icon: Mail,        href: "/dashboard/submissions", color: "text-red-500",     bg: "bg-red-50",        urgent: true  },
    { label: "Total Enquiries", value: data.submissions,           icon: TrendingUp,  href: "/dashboard/submissions", color: "text-[#0f6b72]",   bg: "bg-[#0f6b72]/10", urgent: false },
    { label: "Reviews",         value: data.reviews,               icon: Star,        href: "/dashboard/reviews",     color: "text-[#f4c400]",   bg: "bg-[#f4c400]/10", urgent: false },
    { label: "Services",        value: data.services,              icon: Briefcase,   href: "/dashboard/services",    color: "text-[#0f6b72]",   bg: "bg-[#0f6b72]/10", urgent: false },
    { label: "FAQs",            value: data.faqs,                  icon: HelpCircle,  href: "/dashboard/faqs",        color: "text-purple-500",  bg: "bg-purple-50",    urgent: false },
    { label: "Fee Entries",     value: data.fees,                  icon: DollarSign,  href: "/dashboard/fees",        color: "text-emerald-600", bg: "bg-emerald-50",   urgent: false },
    { label: "Process Steps",   value: data.processSteps,          icon: ListChecks,  href: "/dashboard/process",     color: "text-blue-500",    bg: "bg-blue-50",      urgent: false },
    { label: "Team Members",    value: 2,                          icon: Users,       href: "/dashboard/team",        color: "text-orange-500",  bg: "bg-orange-50",    urgent: false },
  ];

  const contentBreakdown = [
    { name: "Reviews",   count: data.reviews },
    { name: "Services",  count: data.services },
    { name: "FAQs",      count: data.faqs },
    { name: "Fees",      count: data.fees },
    { name: "Steps",     count: data.processSteps },
    { name: "Team",      count: 2 },
  ];

  const quickLinks = [
    { label: "Add new review",        href: "/dashboard/reviews",     icon: Star        },
    { label: "View new enquiries",    href: "/dashboard/submissions", icon: Mail        },
    { label: "Update site settings",  href: "/dashboard/settings",    icon: Settings    },
    { label: "Manage team members",   href: "/dashboard/team",        icon: Users       },
  ];

  return (
    <div className="space-y-6 animate-fadein">
      {/* No Project Selected Message */}
      {!selectedProject ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-[#0f6b72]/10 flex items-center justify-center mb-4">
            <Globe size={32} className="text-[#0f6b72]" />
          </div>
          <h2 className="text-xl font-black text-[#062f36] mb-2">Select a project to get started</h2>
          <p className="text-[#62777d] mb-6 max-w-md">Choose a project from the Projects page to view and manage its content.</p>
          <Link href="/dashboard/projects" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0f6b72] text-white text-sm font-bold hover:bg-[#062f36] transition-colors">
            <Globe size={16} />
            Go to Projects
          </Link>
        </div>
      ) : (
        <>
          {/* Welcome */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-[#062f36]">
                Good{new Date().getHours() < 12 ? " morning" : new Date().getHours() < 17 ? " afternoon" : " evening"}, {user?.name?.split(" ")[0]}!
              </h1>
              <p className="text-[#62777d] mt-1">
                Managing {selectedProject.name}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-[#0f6b72]/8 rounded-xl border border-[#0f6b72]/15">
                <Clock size={14} className="text-[#0f6b72]" />
                <span className="text-xs font-bold text-[#0f6b72]">
                  {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
                </span>
              </div>
              <div className={`w-9 h-9 rounded-full bg-gradient-to-r ${selectedProject.color} flex items-center justify-center text-white text-xs font-black`}>
                {selectedProject.icon}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-3">
            {statCards.map((stat, i) => (
              <Link key={i} href={stat.href} className="group">
                <Card className="p-4 h-full transition-all duration-200 hover:shadow-md">
                  <div className="flex items-start justify-between mb-2">
                    <div className={`p-2 rounded-xl ${stat.bg}`}>
                      <stat.icon size={16} className={stat.color} />
                    </div>
                    {stat.urgent && (
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    )}
                  </div>
                  <div className="text-xl font-black text-[#062f36] leading-none">
                    {loading ? "-" : stat.value}
                  </div>
                  <div className="text-xs text-[#62777d] mt-1 font-bold group-hover:text-[#0f6b72] transition-colors">
                    {stat.label}
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Charts & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Enquiries Chart */}
            <Card className="lg:col-span-2 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-black text-[#062f36]">Enquiry Trend</h3>
                  <p className="text-xs text-[#62777d]">Last 12 months of enquiries</p>
                </div>
                <Link href="/dashboard/submissions" className="text-xs font-bold text-[#0f6b72] flex items-center gap-1 hover:underline">
                  View all <ArrowRight size={12} />
                </Link>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={enquiryTrend}>
                    <defs>
                      <linearGradient id="enqGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0f6b72" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#0f6b72" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#dbe7e9" vertical={false} />
                    <XAxis dataKey="month" hide />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f5f8f8' }} />
                    <Area type="monotone" dataKey="enquiries" stroke="#0f6b72" strokeWidth={2} fill="url(#enqGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Quick Actions */}
            <div className="space-y-3">
              <Card className="p-5">
                <h3 className="font-black text-[#062f36] mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  {quickLinks.map((link, i) => (
                    <Link
                      key={i}
                      href={link.href}
                      className="flex items-center gap-3 p-3 rounded-xl bg-[#f5f8f8] border border-[#dbe7e9] hover:border-[#0f6b72]/30 hover:bg-[#0f6b72]/5 transition-all"
                    >
                      <div className="p-1.5 rounded-lg bg-white shadow-sm">
                        <link.icon size={14} className="text-[#0f6b72]" />
                      </div>
                      <span className="text-sm font-bold text-[#062f36]">
                        {link.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </Card>

              {/* Content Breakdown */}
              <Card className="p-5">
                <h3 className="font-black text-[#062f36] mb-4">Content Breakdown</h3>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={contentBreakdown}>
                      <XAxis dataKey="name" hide />
                      <YAxis hide />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f5f8f8' }} />
                      <Bar dataKey="count" fill="#0f6b72" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </div>

          {/* Recent Enquiries */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-black text-[#062f36]">Recent Enquiries</h3>
                <p className="text-xs text-[#62777d]">Latest submissions from the website</p>
              </div>
            </div>
            <div className="space-y-2">
              {data.submissionsList.map((s: any) => (
                <div key={s.id || s._id} className="flex items-center justify-between p-3 rounded-xl bg-[#f5f8f8] gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0f6b72] to-[#062f36] flex items-center justify-center text-white text-[10px] font-black shrink-0">
                      {s.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#062f36] truncate">{s.name}</p>
                      <p className="text-xs text-[#62777d] truncate">{s.service || s.email}</p>
                    </div>
                  </div>
                  <span className={`shrink-0 text-[10px] font-black px-2 py-0.5 rounded-full border ${statusColor[s.status]}`}>
                    {s.status}
                  </span>
                </div>
              ))}
              {data.submissionsList.length === 0 && (
                <div className="text-center py-6 text-sm text-[#62777d] font-bold">
                  No enquiries yet.
                </div>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
