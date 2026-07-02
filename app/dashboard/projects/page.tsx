
"use client";
import { ExternalLink, Globe, CheckCircle, Clock } from "lucide-react";
import Card from "@/app/components/ui/Card";
import PageHeader from "@/app/components/ui/PageHeader";
import Badge from "@/app/components/ui/Badge";
import { useProject } from "@/app/context/ProjectContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ProjectsPage() {
  const { selectedProject, setSelectedProject, projects } = useProject();
  const router = useRouter();

  const handleProjectClick = (project: any) => {
    if (project.status === "live") {
      setSelectedProject(project);
      toast.success(`Selected ${project.name} project!`);
      router.push("/dashboard");
    } else {
      toast.error("This project is not live yet!");
    }
  };

  return (
    <div className="animate-fadein space-y-6">
      <PageHeader
        title="Projects"
        description="All websites and applications connected to this CMS."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {projects.map((project) => (
          <Card
            key={project.id}
            className={`overflow-hidden transition-all duration-200 cursor-pointer ${selectedProject?.id === project.id ? "ring-2 ring-[#f4c400] shadow-lg" : "hover:shadow-[0_12px_40px_rgba(6,47,54,0.1)] hover:-translate-y-1"}`}
            onClick={() => handleProjectClick(project)}
          >
            {/* Header */}
            <div className={`bg-gradient-to-r ${project.color} p-5`}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center">
                  <span className="font-black text-white text-sm">{project.icon}</span>
                </div>
                <Badge color={project.status === "live" ? "green" : "gray"}>
                  {project.status === "live" ? (
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Clock size={10} /> Planned
                    </span>
                  )}
                </Badge>
              </div>
              <h3 className="font-black text-white text-lg">{project.name}</h3>
              <p className="text-white/80 text-xs mt-2">{project.description}</p>
            </div>

            {/* Body */}
            <div className="p-5">
              {project.sections.length > 0 ? (
                <>
                  <p className="text-xs font-black text-[#62777d] uppercase tracking-wider mb-3">Managed Sections</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.sections.map((section) => (
                      <span
                        key={section}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0f6b72]/8 text-[#0f6b72] text-xs font-bold border border-[#0f6b72]/15"
                      >
                        <CheckCircle size={10} />
                        {section}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-sm text-slate-400 font-bold">Not connected yet</p>
                  <p className="text-xs text-slate-300 mt-1">Configure API connection to get started</p>
                </div>
              )}

              {/* Links */}
              {project.status === "live" && (
                <div className="flex gap-2 pt-3 border-t border-[#dbe7e9]">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl bg-[#0f6b72]/8 text-[#0f6b72] text-xs font-bold border border-[#0f6b72]/15 hover:bg-[#0f6b72]/15 transition-all"
                  >
                    <Globe size={13} /> View Site
                  </a>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (project.apiUrl) {
                        window.open(project.apiUrl, "_blank");
                      }
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl bg-[#f4c400]/10 text-[#7a5f00] text-xs font-bold border border-[#f4c400]/20 hover:bg-[#f4c400]/20 transition-all"
                  >
                    <ExternalLink size={13} /> View API
                  </button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* API Guide */}
      <Card accent className="p-6">
        <h3 className="font-black text-[#062f36] mb-4 flex items-center gap-2">
          <Globe size={18} className="text-[#0f6b72]" /> API Endpoints Reference
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { method: "GET", endpoint: "/api/content/all", desc: "All content in one request (for SSG)" },
            { method: "GET", endpoint: "/api/content/reviews", desc: "Client testimonials" },
            { method: "GET", endpoint: "/api/content/faqs", desc: "FAQ entries" },
            { method: "GET", endpoint: "/api/content/services", desc: "Visa services list" },
            { method: "GET", endpoint: "/api/content/fees", desc: "Fee schedule by category" },
            { method: "GET", endpoint: "/api/content/process-steps", desc: "Application process steps" },
            { method: "GET", endpoint: "/api/content/features", desc: "Why choose us points" },
            { method: "GET", endpoint: "/api/content/settings", desc: "Site settings (phone, email...)" },
            { method: "POST", endpoint: "/api/contact", desc: "Submit contact form" },
            { method: "POST", endpoint: "/api/auth/login", desc: "Get API token" },
          ].map(({ method, endpoint, desc }) => (
            <div key={endpoint} className="flex items-start gap-3 p-3 bg-[#f5f8f8] rounded-xl border border-[#dbe7e9]">
              <span className={`shrink-0 px-2 py-0.5 rounded-lg text-[10px] font-black ${method === "GET" ? "bg-[#0f6b72]/10 text-[#0f6b72]" : "bg-[#f47a2a]/10 text-[#f47a2a]"}`}>
                {method}
              </span>
              <div>
                <code className="text-xs font-bold text-[#062f36]">{endpoint}</code>
                <p className="text-xs text-[#62777d] mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
