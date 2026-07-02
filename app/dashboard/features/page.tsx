"use client";
import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { featuresService, type Feature, type FeaturePayload } from "@/app/services/contentServices";
import PageHeader from "@/app/components/ui/PageHeader";
import DataTable from "@/app/components/ui/DataTable";
import Modal from "@/app/components/ui/Modal";
import ConfirmDialog from "@/app/components/ui/ConfirmDialog";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import Textarea from "@/app/components/ui/Textarea";
import Toggle from "@/app/components/ui/Toggle";
import Badge from "@/app/components/ui/Badge";

type FeatureForm = FeaturePayload;
const empty: FeatureForm = { title: "", description: "", is_active: true, sort_order: 0 };

export default function FeaturesPage() {
  const [data, setData] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [form, setForm] = useState<FeatureForm>(empty);
  const [editId, setEditId] = useState<string | number | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const features = await featuresService.list();
      setData(features);
    } catch (error) {
      toast.error("Failed to load features");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => { 
    setForm(empty); 
    setEditId(null); 
    setModalOpen(true); 
  };
  
  const openEdit = (r: Feature) => { 
    const { _id, id, ...rest } = r; 
    setForm(rest); 
    // Fallback to null if both are missing/undefined to satisfy TypeScript
    setEditId(_id || id || null); 
    setModalOpen(true); 
  };

  const handleSave = async () => {
    if (!form.title) return toast.error("Title is required.");
    try {
      if (editId) {
        await featuresService.update(editId, form);
        toast.success("Updated!");
      } else {
        await featuresService.create(form);
        toast.success("Added!");
      }
      setModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to save feature");
    }
  };

  const handleDelete = async () => {
    try {
      if (!deleteId) return;
      await featuresService.remove(deleteId);
      toast.success("Deleted.");
      setDeleteId(null);
      fetchData();
    } catch (error) {
      toast.error("Failed to delete feature");
    }
  };

  return (
    <div className="animate-fadein space-y-6">
      <PageHeader title="Why Choose Us" description="Manage the trust signals and key features shown on the site.">
        <Button onClick={openCreate}>+ Add Feature</Button>
      </PageHeader>

      <DataTable
        data={data} searchKeys={["title"]} emptyMessage="No features yet."
        columns={[
          { key: "title",       label: "Title",       render: (r) => <span className="font-bold text-[#062f36]">{r.title}</span> },
          { key: "description", label: "Description", render: (r) => <span className="text-[#62777d] max-w-sm block truncate">{r.description}</span> },
          { key: "is_active",   label: "Status",      render: (r) => <Badge color={r.is_active ? "teal" : "gray"}>{r.is_active ? "Active" : "Hidden"}</Badge> },
          { key: "sort_order",  label: "Order",       width: "70px" },
        ]}
        actions={(r) => (
          <>
            <button onClick={() => openEdit(r)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#0f6b72] hover:bg-[#0f6b72]/10 transition-all"><Pencil size={15} /></button>
            <button onClick={() => setDeleteId(r._id || r.id || null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 transition-all"><Trash2 size={15} /></button>
          </>
        )}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? "Edit Feature" : "Add Feature"}>
        <div className="space-y-4">
          <Input label="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Textarea label="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Sort Order" type="number" value={String(form.sort_order)} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
            <div className="flex items-end pb-1"><Toggle checked={form.is_active} onChange={(v) => setForm({ ...form, is_active: v })} label="Active" /></div>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-[#dbe7e9]">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editId ? "Update" : "Add"} Feature</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} message="This will permanently delete this feature." />
    </div>
  );
}