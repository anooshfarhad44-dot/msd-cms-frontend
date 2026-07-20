"use client";
import { useState, useEffect } from "react";
import { Save, Phone, Globe, List, CheckSquare, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { createProjectServices } from "@/app/services/contentServices";
import { useProject } from "@/app/context/ProjectContext";
import PageHeader from "@/app/components/ui/PageHeader";
import Card from "@/app/components/ui/Card";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import Link from "next/link";

// ─── Reusable list editor ─────────────────────────────────────────────────────
function ListEditor({ label, items, onChange, placeholder }: {
  label: string; items: string[]; onChange: (items: string[]) => void; placeholder?: string;
}) {
  const [newItem, setNewItem] = useState("");
  const add = () => { const t = newItem.trim(); if (!t) return; onChange([...items, t]); setNewItem(""); };
  const update = (idx: number, val: string) => { const c = [...items]; c[idx] = val; onChange(c); };
  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));

  return (
    <div>
      <p className="text-xs font-black text-[#062f36] mb-2 uppercase tracking-wide">{label}</p>
      <div className="space-y-2 mb-3">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#0f6b72]/10 text-[#0f6b72] text-[10px] font-black flex items-center justify-center shrink-0">{idx + 1}</span>
            <input value={item} onChange={(e) => update(idx, e.target.value)}
              className="flex-1 h-9 px-3 rounded-xl border border-[#dbe7e9] bg-white text-sm text-[#062f36] font-medium focus:outline-none focus:border-[#0f6b72] focus:ring-2 focus:ring-[#0f6b72]/10" />
            <button onClick={() => remove(idx)} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 transition-all"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={newItem} onChange={(e) => setNewItem(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder={placeholder || "Add new item..."}
          className="flex-1 h-9 px-3 rounded-xl border border-dashed border-[#0f6b72]/40 bg-[#0f6b72]/4 text-sm text-[#062f36] font-medium focus:outline-none focus:border-[#0f6b72]" />
        <button onClick={add} className="h-9 px-4 rounded-xl bg-[#0f6b72] text-white text-xs font-black flex items-center gap-1.5 hover:bg-[#0a5059] transition-all">
          <Plus size={13} /> Add
        </button>
      </div>
    </div>
  );
}

// ─── Default empty settings shape (union of spouse-visa + british-citizenship) ─
const emptySettings: any = {
  contact_phone: "", contact_phone_href: "",
  contact_email: "", contact_email_href: "",
  contact_whatsapp: "", contact_whatsapp_href: "",
  parent_site_name: "", parent_site_url: "",
  nav_items: [],
  countries: [],
  // spouse-visa fields
  visa_services: [], home_highlights: [], quick_steps: [],
  eligibility_requirements: [], document_groups: [], fee_options: [], service_items: [],
  // british-citizenship fields
  citizenship_services: [], eligibility_routes: [],
};

export default function SettingsPage() {
  const { selectedProject } = useProject();
  const [settings, setSettings] = useState<any>(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const svc = selectedProject ? createProjectServices(selectedProject.apiPrefix).settings : null;
  const isBC = selectedProject?.apiPrefix === "british-citizenship";

  const fetchData = async () => {
    if (!svc) return;
    try {
      setLoading(true);
      const data = await svc.get();
      setSettings({ ...emptySettings, ...data });
    } catch { toast.error("Failed to load settings"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [selectedProject]);

  const set = (key: string, val: string) => setSettings((prev: any) => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    if (!svc) return;
    setSaving(true);
    try {
      await svc.update(settings);
      toast.success("Settings saved!");
    } catch { toast.error("Failed to save settings"); }
    finally { setSaving(false); }
  };

  const SectionHeader = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
    <div className="flex items-start gap-3 mb-5 pb-4 border-b border-[#dbe7e9]">
      <div className="w-10 h-10 rounded-xl bg-[#0f6b72]/10 flex items-center justify-center shrink-0">
        <Icon size={18} className="text-[#0f6b72]" />
      </div>
      <div>
        <h3 className="font-black text-[#062f36] text-base">{title}</h3>
        <p className="text-xs text-[#62777d] mt-0.5">{description}</p>
      </div>
    </div>
  );

  if (!selectedProject) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-[#0f6b72]/10 flex items-center justify-center mb-4"><Globe size={32} className="text-[#0f6b72]" /></div>
        <h2 className="text-xl font-black text-[#062f36] mb-2">No project selected</h2>
        <p className="text-[#62777d] mb-6">Choose a project first to manage its settings.</p>
        <Link href="/dashboard/projects" className="px-4 py-2 rounded-xl bg-[#0f6b72] text-white text-sm font-bold hover:bg-[#062f36] transition-colors">Go to Projects</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="animate-fadein space-y-6 max-w-3xl">
        <PageHeader title="Site Settings" description="Loading..." />
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} accent className="p-6">
              <div className="h-8 bg-slate-100 rounded mb-4 animate-pulse" />
              <div className="space-y-4"><div className="h-10 bg-slate-100 rounded animate-pulse" /><div className="h-10 bg-slate-100 rounded animate-pulse" /></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadein space-y-6 max-w-3xl">
      <PageHeader title={`Settings — ${selectedProject.name}`} description="Manage contact info, lists, and global site settings." />

      {/* Contact Info */}
      <Card accent className="p-6">
        <SectionHeader icon={Phone} title="Contact Information" description="Phone, email and WhatsApp details used across all site pages." />
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Phone Number"      value={settings.contact_phone     || ""} onChange={(e) => set("contact_phone",      e.target.value)} placeholder="0161 503 0553" />
            <Input label="Phone href"        value={settings.contact_phone_href || ""} onChange={(e) => set("contact_phone_href", e.target.value)} placeholder="tel:+441615030553" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Email"             value={settings.contact_email      || ""} onChange={(e) => set("contact_email",      e.target.value)} />
            <Input label="Email href"        value={settings.contact_email_href  || ""} onChange={(e) => set("contact_email_href", e.target.value)} placeholder="mailto:..." />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="WhatsApp Number"   value={settings.contact_whatsapp      || ""} onChange={(e) => set("contact_whatsapp",      e.target.value)} />
            <Input label="WhatsApp href"     value={settings.contact_whatsapp_href || ""} onChange={(e) => set("contact_whatsapp_href", e.target.value)} placeholder="https://wa.me/44..." />
          </div>
        </div>
      </Card>

      {/* Site Info */}
      <Card accent className="p-6">
        <SectionHeader icon={Globe} title="Site Information" description="Firm name and parent website URL." />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Firm / Site Name" value={settings.parent_site_name || ""} onChange={(e) => set("parent_site_name", e.target.value)} placeholder="MSD Solicitors" />
          <Input label="Parent Site URL"  value={settings.parent_site_url  || ""} onChange={(e) => set("parent_site_url",  e.target.value)} placeholder="https://msdsolicitors.co.uk" />
        </div>
      </Card>

      {/* Eligibility — spouse visa */}
      {!isBC && (
        <Card accent className="p-6">
          <SectionHeader icon={CheckSquare} title="Eligibility Points" description="Shown on the home page eligibility section." />
          <ListEditor
            label="Requirements"
            items={settings.eligibility_requirements || []}
            onChange={(items) => setSettings((prev: any) => ({ ...prev, eligibility_requirements: items }))}
            placeholder="e.g. You are over 18 years of age"
          />
        </Card>
      )}

      {/* Eligibility routes — british citizenship */}
      {isBC && (
        <Card accent className="p-6">
          <SectionHeader icon={CheckSquare} title="Eligibility Routes" description="Citizenship routes shown on the eligibility section." />
          <ListEditor
            label="Routes"
            items={settings.eligibility_routes || []}
            onChange={(items) => setSettings((prev: any) => ({ ...prev, eligibility_routes: items }))}
            placeholder="e.g. Married to a British Citizen"
          />
        </Card>
      )}

      {/* Lists */}
      <Card accent className="p-6">
        <SectionHeader icon={List} title="Lists & Options" description="Used in contact forms and dropdown menus." />
        <div className="space-y-4">
          <Input
            label="Countries (comma-separated)"
            value={settings.countries?.join(", ") || ""}
            onChange={(e) => setSettings((prev: any) => ({ ...prev, countries: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) }))}
            placeholder="Pakistan, India, Bangladesh..."
          />
          {isBC ? (
            <Input
              label="Citizenship Services (comma-separated)"
              value={settings.citizenship_services?.join(", ") || ""}
              onChange={(e) => setSettings((prev: any) => ({ ...prev, citizenship_services: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) }))}
              placeholder="British Citizenship with ILR, Spouse Route..."
            />
          ) : (
            <Input
              label="Visa Services (comma-separated)"
              value={settings.visa_services?.join(", ") || ""}
              onChange={(e) => setSettings((prev: any) => ({ ...prev, visa_services: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) }))}
              placeholder="Spouse Visa, Student Visa..."
            />
          )}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} loading={saving} size="lg">
          <Save size={17} /> Save All Settings
        </Button>
      </div>
    </div>
  );
}
