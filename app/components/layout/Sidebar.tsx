// "use client";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   LayoutDashboard, Users, Settings, Mail, Globe,
//   ChevronDown, ChevronRight, X, Layers,
// } from "lucide-react";
// import { useState } from "react";

// interface NavItem {
//   href?: string;
//   label: string;
//   icon: React.ReactNode;
//   children?: { href: string; label: string }[];
//   badge?: number;
// }

// const navItems: NavItem[] = [
//   { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
//   { href: "/dashboard/projects", label: "Projects", icon: <Globe size={18} /> },
//   {
//     label: "Content",
//     icon: <Layers size={18} />,
//     children: [
//       { href: "/dashboard/reviews",      label: "Reviews" },
//       { href: "/dashboard/faqs",         label: "FAQs" },
//       { href: "/dashboard/services",     label: "Services" },
//       { href: "/dashboard/fees",         label: "Fees" },
//       { href: "/dashboard/process",      label: "Process Steps" },
//       { href: "/dashboard/features",     label: "Why Choose Us" },
//       { href: "/dashboard/team",         label: "Team Members" },
//     ],
//   },
//   { href: "/dashboard/submissions", label: "Enquiries", icon: <Mail size={18} /> },
//   { href: "/dashboard/settings",    label: "Site Settings", icon: <Settings size={18} /> },
//   { href: "/dashboard/users",       label: "Users", icon: <Users size={18} /> },
// ];

// interface SidebarProps {
//   open: boolean;
//   onClose: () => void;
// }

// export default function Sidebar({ open, onClose }: SidebarProps) {
//   const pathname = usePathname();
//   const [expanded, setExpanded] = useState<string[]>(["Content"]);

//   const toggleGroup = (label: string) => {
//     setExpanded((prev) =>
//       prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
//     );
//   };

//   const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

//   return (
//     <>
//       {/* Mobile overlay */}
//       {open && (
//         <div
//           className="fixed inset-0 z-30 bg-[#062f36]/50 backdrop-blur-sm lg:hidden"
//           onClick={onClose}
//         />
//       )}

//       <aside
//         className={`fixed top-0 left-0 h-full z-40 w-64 bg-gradient-to-b from-[#062f36] to-[#0a3d45] flex flex-col transition-transform duration-300
//           ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}
//       >
//         {/* Logo */}
//         <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
//           <Link href="/dashboard" className="flex items-center gap-3">
//             <div className="w-9 h-9 rounded-xl bg-[#f4c400] flex items-center justify-center shrink-0">
//               <span className="font-black text-[#062f36] text-xs">MSD</span>
//             </div>
//             <div>
//               <p className="font-black text-white text-sm leading-none">MSD Solicitord</p>
//               <p className="text-white/50 text-xs mt-0.5">CMS</p>
//             </div>
//           </Link>
//           <button onClick={onClose} className="lg:hidden text-white/60 hover:text-white p-1">
//             <X size={18} />
//           </button>
//         </div>

//         {/* Nav */}
//         <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
//           {navItems.map((item) => {
//             if (item.children) {
//               const isOpen = expanded.includes(item.label);
//               const anyChildActive = item.children.some((c) => isActive(c.href));

//               return (
//                 <div key={item.label}>
//                   <button
//                     onClick={() => toggleGroup(item.label)}
//                     className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all
//                       ${anyChildActive ? "text-white" : "text-white/70 hover:text-white hover:bg-white/8"}`}
//                   >
//                     <span className="flex items-center gap-3">
//                       <span className="opacity-80">{item.icon}</span>
//                       {item.label}
//                     </span>
//                     {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
//                   </button>

//                   {isOpen && (
//                     <div className="mt-1 ml-4 pl-3 border-l border-white/10 space-y-0.5">
//                       {item.children.map((child) => (
//                         <Link
//                           key={child.href}
//                           href={child.href}
//                           onClick={onClose}
//                           className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all
//                             ${isActive(child.href)
//                               ? "bg-[#f4c400] text-[#062f36]"
//                               : "text-white/60 hover:text-white hover:bg-white/8"}`}
//                         >
//                           {child.label}
//                         </Link>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               );
//             }

//             return (
//               <Link
//                 key={item.href}
//                 href={item.href!}
//                 onClick={onClose}
//                 className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all
//                   ${isActive(item.href!)
//                     ? "bg-[#f4c400] text-[#062f36] shadow-[0_4px_14px_rgba(244,196,0,0.3)]"
//                     : "text-white/70 hover:text-white hover:bg-white/8"}`}
//               >
//                 <span className="opacity-80">{item.icon}</span>
//                 {item.label}
//                 {item.badge ? (
//                   <span className="ml-auto bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
//                     {item.badge}
//                   </span>
//                 ) : null}
//               </Link>
//             );
//           })}
//         </nav>

//         {/* Bottom */}
//         <div className="px-4 py-4 border-t border-white/10">
//           <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest text-center">
//             MSD Solicitord CMS v1.0
//           </p>
//         </div>
//       </aside>
//     </>
//   );
// }













"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, Settings, Mail, Globe,
  ChevronDown, ChevronRight, X, Layers,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useProject } from "@/app/context/ProjectContext";

interface NavItem {
  href?: string;
  label: string;
  icon: React.ReactNode;
  children?: { href: string; label: string }[];
  badge?: number;
}

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { selectedProject, projects } = useProject();
  const [expanded, setExpanded] = useState<string[]>(["Content"]);

  // Create nav items dynamically based on selected project
  const getNavItems = (): NavItem[] => {
    const items: NavItem[] = [
      { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
      { href: "/dashboard/projects", label: "Projects", icon: <Globe size={18} /> },
    ];

    // Only add content items if a project is selected
    if (selectedProject && selectedProject.status === "live") {
      // Map sections to actual routes
      const sectionToRoute: Record<string, string> = {
        "Reviews": "/dashboard/reviews",
        "Eligibility Points": "/dashboard/eligibility",
        "FAQs": "/dashboard/faqs",
        "Services": "/dashboard/services",
        "Fees": "/dashboard/fees",
        "Process Steps": "/dashboard/process",
        "Why Choose Us": "/dashboard/features",
        "Team Members": "/dashboard/team",
        "Site Settings": "/dashboard/settings",
      };

      const contentChildren = selectedProject.sections
        .filter(section => sectionToRoute[section])
        .map(section => ({
          href: sectionToRoute[section],
          label: section,
        }));

      if (contentChildren.length > 0) {
        items.push({
          label: "Content",
          icon: <Layers size={18} />,
          children: contentChildren,
        });

        items.push({
          href: "/dashboard/submissions",
          label: "Enquiries",
          icon: <Mail size={18} />,
        });
      }
    }

    items.push({
      href: "/dashboard/users",
      label: "Users",
      icon: <Users size={18} />,
    });

    return items;
  };

  const navItems = getNavItems();

  const toggleGroup = (label: string) => {
    setExpanded((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  // Sahi url checking logic
  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  // Agar child route active hai toh automatically parent group ko open rakhne ke liye logic
  useEffect(() => {
    const contentChildren = [
      "/dashboard/reviews",
      "/dashboard/faqs",
      "/dashboard/services",
      "/dashboard/fees",
      "/dashboard/process",
      "/dashboard/features",
      "/dashboard/team",
      "/dashboard/settings",
    ];
    const hasActiveChild = contentChildren.some((href) => isActive(href));
    if (hasActiveChild) {
      setExpanded((prev) => prev.includes("Content") ? prev : [...prev, "Content"]);
    }
  }, [pathname]);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-[#062f36]/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-40 w-64 bg-gradient-to-b from-[#062f36] to-[#0a3d45] flex flex-col transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-r ${selectedProject ? selectedProject.color : "from-[#062f36] to-[#0f6b72]"} flex items-center justify-center shrink-0`}>
              <span className="font-black text-white text-xs">{selectedProject ? selectedProject.icon : "MSD"}</span>
            </div>
            <div>
              <p className="font-black text-white text-sm leading-none">{selectedProject ? selectedProject.name : "MSD Solicitord"}</p>
              <p className="text-white/50 text-xs mt-0.5">{selectedProject ? "CMS" : "Content Management System"}</p>
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden text-white/60 hover:text-white p-1">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            if (item.children) {
              const isOpen = expanded.includes(item.label);
              const anyChildActive = item.children.some((c) => isActive(c.href));

              return (
                <div key={item.label} className="space-y-0.5">
                  <button
                    onClick={() => toggleGroup(item.label)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all
                      ${anyChildActive 
                        ? "bg-white/10 text-white" 
                        : "text-white/70 hover:text-white hover:bg-white/8"}`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`${anyChildActive ? "text-[#f4c400]" : "opacity-80"}`}>
                        {item.icon}
                      </span>
                      {item.label}
                    </span>
                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>

                  {isOpen && (
                    <div className="mt-1 ml-4 pl-3 border-l border-white/10 space-y-0.5">
                      {item.children.map((child) => {
                        const childActive = isActive(child.href);
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={onClose}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all
                              ${childActive
                                ? "bg-[#f4c400] text-[#062f36] shadow-[0_2px_8px_rgba(244,196,0,0.2)]"
                                : "text-white/60 hover:text-white hover:bg-white/8"}`}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href!}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all
                  ${isActive(item.href!)
                    ? "bg-[#f4c400] text-[#062f36] shadow-[0_4px_14px_rgba(244,196,0,0.3)]"
                    : "text-white/70 hover:text-white hover:bg-white/8"}`}
              >
                <span className="opacity-80">{item.icon}</span>
                {item.label}
                {item.badge ? (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-4 py-4 border-t border-white/10">
          <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest text-center">
            MSD Solicitord CMS v1.0
          </p>
        </div>
      </aside>
    </>
  );
}