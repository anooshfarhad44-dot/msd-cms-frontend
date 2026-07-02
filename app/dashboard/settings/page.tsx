"use client";
import { useState, useEffect } from "react";
import { Save, Phone, Globe, List, CheckSquare, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { settingsService, type SiteSettings } from "@/app/services/contentServices";
import PageHeader from "@/app/components/ui/PageHeader";
import Card from "@/app/components/ui/Card";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";

const emptySettings: SiteSettings = {
  contact_phone: "",
  contact_phone_href: "",
  contact_email: "",
  contact_email_href: "",
  contact_whatsapp: "",
  contact_whatsapp_href: "",
  parent_site_name: "",
  parent_site_url: "",
  nav_items: [],
  countries: [],
  visa_services: [],
  home_highlights: [],
  quick_steps: [],
  eligibility_requirements: [],
  document_groups: [],
  fee_options: [],
  service_items: [],
};

// ─── Reusable list editor (add / edit inline / delete per item) ───────────────
function ListEditor({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  const [newItem, setNewItem] = useState("");

  const add = () => {
    const trimmed = newItem.trim();
    if (!trimmed) return;
    onChange([...items, trimmed]);
    setNewItem("");
  };

  const update = (idx: number, val: string) => {
    const copy = [...items];
    copy[idx] = val;
    onChange(copy);
  };

  const remove = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <p className="text-xs font-black text-[#062f36] mb-2 uppercase tracking-wide">{label}</p>
      <div className="space-y-2 mb-3">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#0f6b72]/10 text-[#0f6b72] text-[10px] font-black flex items-center justify-center shrink-0">
              {idx + 1}
            </span>
            <input
              value={item}
              onChange={(e) => update(idx, e.target.value)}
              className="flex-1 h-9 px-3 rounded-xl border border-[#dbe7e9] bg-white text-sm text-[#062f36] font-medium focus:outline-none focus:border-[#0f6b72] focus:ring-2 focus:ring-[#0f6b72]/10"
            />
            <button
              onClick={() => remove(idx)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder={placeholder || "Add new item..."}
          className="flex-1 h-9 px-3 rounded-xl border border-dashed border-[#0f6b72]/40 bg-[#0f6b72]/4 text-sm text-[#062f36] font-medium focus:outline-none focus:border-[#0f6b72] focus:ring-2 focus:ring-[#0f6b72]/10"
        />
        <button
          onClick={add}
          className="h-9 px-4 rounded-xl bg-[#0f6b72] text-white text-xs font-black flex items-center gap-1.5 hover:bg-[#0a5059] transition-all"
        >
          <Plus size={13} /> Add
        </button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await settingsService.get();
      setSettings({ ...emptySettings, ...data });
    } catch (error) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const set = (key: keyof SiteSettings, val: string) =>
    setSettings((prev) => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsService.update(settings);
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
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

  if (loading) {
    return (
      <div className="animate-fadein space-y-6 max-w-3xl">
        <PageHeader title="Site Settings" description="Manage global site settings — contact info, eligibility points, and more." />
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} accent className="p-6">
              <div className="h-8 bg-slate-100 rounded mb-4" />
              <div className="space-y-4">
                <div className="h-10 bg-slate-100 rounded" />
                <div className="h-10 bg-slate-100 rounded" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadein space-y-6 max-w-3xl">
      <PageHeader title="Site Settings" description="Manage global site settings — contact info, eligibility points, and more." />

      {/* Contact Info */}
      <Card accent className="p-6">
        <SectionHeader icon={Phone} title="Contact Information" description="Phone, email and WhatsApp details used across all site pages." />
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Phone Number" value={settings.contact_phone} onChange={(e) => set("contact_phone", e.target.value)} placeholder="0161 503 0553" />
            <Input label="Phone Link (tel: href)" value={settings.contact_phone_href} onChange={(e) => set("contact_phone_href", e.target.value)} placeholder="tel:+441615030553" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Email Address" type="email" value={settings.contact_email} onChange={(e) => set("contact_email", e.target.value)} />
            <Input label="Email Link (mailto: href)" value={settings.contact_email_href} onChange={(e) => set("contact_email_href", e.target.value)} placeholder="mailto:info@msd.com" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="WhatsApp Display Number" value={settings.contact_whatsapp} onChange={(e) => set("contact_whatsapp", e.target.value)} />
            <Input label="WhatsApp Link (wa.me URL)" value={settings.contact_whatsapp_href} onChange={(e) => set("contact_whatsapp_href", e.target.value)} placeholder="https://wa.me/44..." />
          </div>
        </div>
      </Card>

      {/* Site Info */}
      <Card accent className="p-6">
        <SectionHeader icon={Globe} title="Site Information" description="Firm name and parent website URL." />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Firm / Site Name" value={settings.parent_site_name} onChange={(e) => set("parent_site_name", e.target.value)} placeholder="MSD Solicitors" />
          <Input label="Parent Site URL" value={settings.parent_site_url} onChange={(e) => set("parent_site_url", e.target.value)} placeholder="https://msdsolicitors.co.uk" />
        </div>
      </Card>

      {/* Eligibility Requirements — full CRUD list editor */}
      <Card accent className="p-6">
        <SectionHeader
          icon={CheckSquare}
          title="Eligibility Points"
          description="These points are shown on the home page eligibility section. Add, edit or remove individual requirements."
        />
        <ListEditor
          label="Requirements"
          items={settings.eligibility_requirements || []}
          onChange={(items) => setSettings((prev) => ({ ...prev, eligibility_requirements: items }))}
          placeholder="e.g. You are over 18 years of age"
        />
      </Card>

      {/* Lists & Options */}
      <Card accent className="p-6">
        <SectionHeader icon={List} title="Lists & Options" description="Used in contact forms and dropdown menus. Edit as comma-separated values." />
        <div className="space-y-4">
          <Input
            label="Countries (comma-separated)"
            value={settings.countries?.join(", ") || ""}
            onChange={(e) => setSettings((prev) => ({ ...prev, countries: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }))}
            placeholder="Pakistan, India, Bangladesh..."
          />
          <Input
            label="Visa Services (comma-separated)"
            value={settings.visa_services?.join(", ") || ""}
            onChange={(e) => setSettings((prev) => ({ ...prev, visa_services: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }))}
            placeholder="Spouse Visa, Student Visa..."
          />
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
