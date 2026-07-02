"use client";
import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { processStepsService, type ProcessStep, type ProcessStepPayload } from "@/app/services/contentServices";
import PageHeader from "@/app/components/ui/PageHeader";
import DataTable from "@/app/components/ui/DataTable";
import Modal from "@/app/components/ui/Modal";
import ConfirmDialog from "@/app/components/ui/ConfirmDialog";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import Textarea from "@/app/components/ui/Textarea";
import Toggle from "@/app/components/ui/Toggle";
import Badge from "@/app/components/ui/Badge";

type Step = ProcessStep;
type StepForm = ProcessStepPayload;
// FIX: Backend field is "text", not "description"
const empty: StepForm = { title: "", text: "", is_active: true, sort_order: 0 };

export default function ProcessPage() {
  const [data, setData] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [form, setForm] = useState<StepForm>(empty);
  const [editId, setEditId] = useState<string | number | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const steps = await processStepsService.list();
      setData(steps);
    } catch (error) {
      toast.error("Failed to load process steps");
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
  
  const openEdit = (r: Step) => { 
    const { _id, id, ...rest } = r; 
    setForm(rest); 
    // Fallback null to satisfy strict check
    setEditId(_id || id || null); 
    setModalOpen(true); 
  };

  const handleSave = async () => {
    if (!form.title) return toast.error("Title is required.");
    try {
      if (editId) {
        await processStepsService.update(editId, form);
        toast.success("Step updated!");
      } else {
        await processStepsService.create(form);
        toast.success("Step added!");
      }
      setModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to save step");
    }
  };

  const handleDelete = async () => {
    try {
      if (!deleteId) return;
      await processStepsService.remove(deleteId);
      toast.success("Deleted.");
      setDeleteId(null);
      fetchData();
    } catch (error) {
      toast.error("Failed to delete step");
    }
  };

  return (
    <div className="animate-fadein space-y-6">
      <PageHeader title="Process Steps" description="Manage the step-by-step visa application process shown on the site.">
        <Button onClick={openCreate}>+ Add Step</Button>
      </PageHeader>

      <DataTable
        data={data} searchKeys={["title"]} emptyMessage="No process steps yet."
        columns={[
          { key: "sort_order", label: "#",          width: "60px", render: (r) => <span className="w-7 h-7 rounded-full bg-[#0f6b72] text-white text-xs font-black flex items-center justify-center">{r.sort_order + 1}</span> },
          { key: "title",      label: "Step Title", render: (r) => <span className="font-bold text-[#062f36]">{r.title}</span> },
          { key: "text",       label: "Description", render: (r) => <span className="text-[#62777d] max-w-sm block truncate">{r.text}</span> },
          { key: "is_active",  label: "Status",     render: (r) => <Badge color={r.is_active ? "teal" : "gray"}>{r.is_active ? "Active" : "Hidden"}</Badge> },
        ]}
        actions={(r) => (
          <>
            <button onClick={() => openEdit(r)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#0f6b72] hover:bg-[#0f6b72]/10 transition-all"><Pencil size={15} /></button>
            <button onClick={() => setDeleteId(r._id || r.id || null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 transition-all"><Trash2 size={15} /></button>
          </>
        )}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? "Edit Step" : "Add Step"}>
        <div className="space-y-4">
          <Input label="Step Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Case Review" />
          {/* FIX: field is "text" not "description" */}
          <Textarea label="Description" rows={4} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Sort Order" type="number" value={String(form.sort_order)} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
            <div className="flex items-end pb-1"><Toggle checked={form.is_active} onChange={(v) => setForm({ ...form, is_active: v })} label="Active" /></div>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-[#dbe7e9]">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editId ? "Update" : "Add"} Step</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} message="This will permanently delete this process step." />
    </div>
  );
}