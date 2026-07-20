"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getApiBaseUrl } from "@/app/lib/api";

export interface Project {
  id: string | number;
  name: string;
  description: string;
  url: string;
  apiUrl: string;
  apiPrefix: string;          // e.g. "spouse-visa" | "british-citizenship"
  status: "live" | "planned";
  color: string;
  icon: string;
  sections: string[];
}

interface ProjectContextType {
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  projects: Project[];
}

const defaultProjects: Project[] = [
  {
    id: 1,
    name: "Spouse Visa",
    description: "MSD Spouse Visa site — UK spouse & family visa applications.",
    url: "https://www.msdspousevisa.co.uk",
    apiUrl: getApiBaseUrl(),
    apiPrefix: "spouse-visa",
    status: "live",
    color: "from-[#062f36] to-[#0f6b72]",
    icon: "SV",
    sections: ["Reviews", "FAQs", "Services", "Fees", "Process Steps", "Features", "Blog Posts", "Logos", "Chatbot", "Settings", "Submissions"],
  },
  {
    id: 2,
    name: "British Citizenship",
    description: "MSD British Citizenship site — naturalisation & citizenship applications.",
    url: "https://www.msdbritishcitizenship.co.uk",
    apiUrl: getApiBaseUrl(),
    apiPrefix: "british-citizenship",
    status: "live",
    color: "from-[#7a003c] to-[#5a0028]",
    icon: "BC",
    sections: ["Reviews", "FAQs", "Fees", "Features", "Process Steps", "Blog Posts", "Logos", "Settings", "Submissions"],
  },
  {
    id: 3,
    name: "Project 3",
    description: "Coming soon — connect your next project to this CMS.",
    url: "#",
    apiUrl: "#",
    apiPrefix: "",
    status: "planned",
    color: "from-slate-400 to-slate-500",
    icon: "P3",
    sections: [],
  },
];

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects] = useState<Project[]>(defaultProjects);

  // Load selected project from localStorage on mount
  useEffect(() => {
    const savedProjectId = localStorage.getItem("selectedProjectId");
    if (savedProjectId) {
      const project = projects.find((p) => p.id.toString() === savedProjectId);
      if (project) setSelectedProject(project);
    }
  }, [projects]);

  // Save selected project to localStorage when it changes
  useEffect(() => {
    if (selectedProject) {
      localStorage.setItem("selectedProjectId", selectedProject.id.toString());
    } else {
      localStorage.removeItem("selectedProjectId");
    }
  }, [selectedProject]);

  return (
    <ProjectContext.Provider value={{ selectedProject, setSelectedProject, projects }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}
