"use client";
import { useState, useEffect } from "react";
import { Pencil, Trash2, Globe } from "lucide-react";
import toast from "react-hot-toast";
import { createProjectServices } from "@/app/services/contentServices";
import { useProject } from "@/app/context/ProjectContext";
import PageHeader from "@/app/components/ui/PageHeader";
import DataTable from "@/app/components/ui/DataTable";
import Modal from "@/app/components/ui/Modal";
import ConfirmDialog from "@/app/components/ui/ConfirmDialog";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import Toggle from "@/app/components/ui/Toggle";
import Badge from "@/app/components/ui/Badge";
import Select from "@/app/components/ui/Select";
import Link from "next/link";

// Spouse Visa: personal | business | appeals
// British Citizenship: solicitor | home_office
const SPOUSE_VISA_CATS  = ["personal", "business", "appeals"];
const BC_CATS           = ["solicitor", "home_office"];

export default function FeesPage() {
  const { selectedProject } = useProject();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [form, setForm] = useState<any>({});
  const [editId, setEditId] = useState<string | number | null>(null);

  const isBC = selectedProject?.apiPrefix === "british-citizenship";
  const categories = isBC ? BC_CATS : SPOUSE_VISA_CATS;
  const defaultCat = isBC ? "solicitor" : "personal";
  const empty = { label: "", price: "", category: defaultCat, note: "", is_main: false, is_active: true, sort_order: 0 };

  const svc = selectedProject ? createProjectServices(selectedProject.apiPrefix).fees : null;

  const fetchData = async () => {
    if (!svc) return;
    try {
      setLoading(true);
      setData(await svc.list());
    } catch { toast.error("Failed to load fees"); }
    finally { setLoading(false); }
  };

  useEffect(() => { setForm(empty); fetchData(); }, [selectedProject]);

  const openCreate = () => { setForm({ ...empty, category: defaultCat }); setEditId(null); setModalOpen(true); };
  const openEdit = (r: any) => { const { _id, id, ...rest } = r; setForm(rest); setEditId(_id || id || null); setModalOpen(true); };

  const handleSave = async () => {
    if (!svc) return;
    if (!form.label || !form.price) return toast.error("Label and price are required.");
    try {
      if (editId) { await svc.update(editId, form); toast.success("Fee updated!"); }
      else        { await svc.create(form);          toast.success("Fee added!"); }
      setModalOpen(false);
      fetchData();
    } catch { toast.error("Failed to save fee"); }
  };

  const handleDelete = async () => {
    if (!svc || !deleteId) return;
    try {
      await svc.remove(deleteId);
      toast.success("Deleted.");
      setDeleteId(null);
      fetchData();
    } catch { toast.error("Failed to delete fee"); }
  };

  const catColor: Record<string, any> = {
    personal: "teal", business: "gold", appeals: "orange",
    solicitor: "teal", home_office: "gold",
  };

  if (!selectedProject) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-[#0f6b72]/10 flex items-center justify-center mb-4"><Globe size={32} className="text-[#0f6b72]" /></div>
        <h2 className="text-xl font-black text-[#062f36] mb-2">No project selected</h2>
        <p className="text-[#62777d] mb-6">Choose a project first to manage its fees.</p>
        <Link href="/dashboard/projects" className="px-4 py-2 rounded-xl bg-[#0f6b72] text-white text-sm font-bold hover:bg-[#062f36] transition-colors">Go to Projects</Link>
      </div>
    );
  }

  return (
    <div className="animate-fadein space-y-6">
      <PageHeader title="Fees" description={`Manage fee schedule for ${selectedProject.name}.`}>
        <Button onClick={openCreate}>+ Add Fee</Button>
      </PageHeader>

      <DataTable
        data={data} searchKeys={["label"]} emptyMessage="No fees yet."
        columns={[
          { key: "label",      label: "Service",     render: (r) => <span className="font-bold text-[#062f36]">{r.label}</span> },
          { key: "price",      label: "Price",       render: (r) => <span className="font-black text-[#0f6b72]">{r.price}</span> },
          { key: "category",   label: "Category",    render: (r) => <Badge color={catColor[r.category] || "gray"}>{r.category}</Badge> },
          ...(isBC ? [{ key: "note", label: "Note", render: (r: any) => <span className="text-xs text-[#62777d] truncate max-w-[160px] block">{r.note || "—"}</span> }] : []),
          { key: "is_main",    label: "Highlighted", render: (r) => r.is_main ? <Badge color="gold">⭐ Main</Badge> : <span className="text-slate-300 text-xs">—</span> },
          { key: "is_active",  label: "Status",      render: (r) => <Badge color={r.is_active ? "teal" : "gray"}>{r.is_active ? "Active" : "Hidden"}</Badge> },
          { key: "sort_order", label: "Order",       width: "70px" },
        ]}
        actions={(r) => (
          <>
            <button onClick={() => openEdit(r)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#0f6b72] hover:bg-[#0f6b72]/10 transition-all"><Pencil size={15} /></button>
            <button onClick={() => setDeleteId(r._id || r.id || null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 transition-all"><Trash2 size={15} /></button>
          </>
        )}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? "Edit Fee" : "Add Fee"} size="md">
        <div className="space-y-4">
          <Input label="Service Label" required value={form.label || ""} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="e.g. Spouse Visa Application" />
          <Input label="Price" required value={form.price || ""} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="e.g. £800 – £1,500" />
          {isBC && (
            <Input label="Note (optional)" value={form.note || ""} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="e.g. Home Office fee" />
          )}
          <Select
            label="Category" required value={form.category || defaultCat}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            options={categories.map((c) => ({ value: c, label: c.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()) }))}
          />
          <div className="grid grid-cols-3 gap-4">
            <Input label="Sort Order" type="number" value={String(form.sort_order ?? 0)} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
            <div className="flex items-end pb-1"><Toggle checked={!!form.is_main}   onChange={(v) => setForm({ ...form, is_main: v })}   label="Highlighted" /></div>
            <div className="flex items-end pb-1"><Toggle checked={!!form.is_active} onChange={(v) => setForm({ ...form, is_active: v })} label="Active" /></div>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-[#dbe7e9]">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editId ? "Update" : "Add"} Fee</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} message="This will permanently delete the fee entry." />
    </div>
  );
}
