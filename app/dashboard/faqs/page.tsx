"use client";
import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { faqsService, type Faq, type FaqPayload } from "@/app/services/contentServices";
import PageHeader from "@/app/components/ui/PageHeader";
import DataTable from "@/app/components/ui/DataTable";
import Modal from "@/app/components/ui/Modal";
import ConfirmDialog from "@/app/components/ui/ConfirmDialog";
import Button from "@/app/components/ui/Button";
import Textarea from "@/app/components/ui/Textarea";
import Input from "@/app/components/ui/Input";
import Toggle from "@/app/components/ui/Toggle";
import Badge from "@/app/components/ui/Badge";

type FaqForm = FaqPayload;
const empty: FaqForm = { question: "", answer: "", is_active: true, sort_order: 0 };

export default function FaqsPage() {
  const [data, setData] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [form, setForm] = useState<FaqForm>(empty);
  const [editId, setEditId] = useState<string | number | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const faqs = await faqsService.list();
      setData(faqs);
    } catch {
      toast.error("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => { setForm(empty); setEditId(null); setModalOpen(true); };
  const openEdit = (r: Faq) => { const { _id, id, ...rest } = r; setForm(rest); setEditId(_id || id || null); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.question || !form.answer) return toast.error("Question and answer are required.");
    try {
      if (editId) {
        await faqsService.update(editId, form);
        toast.success("FAQ updated!");
      } else {
        await faqsService.create(form);
        toast.success("FAQ added!");
      }
      setModalOpen(false);
      fetchData();
    } catch {
      toast.error("Failed to save FAQ");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await faqsService.remove(deleteId);
      toast.success("FAQ deleted.");
      setDeleteId(null);
      fetchData();
    } catch {
      toast.error("Failed to delete FAQ");
    }
  };

  return (
    <div className="animate-fadein space-y-6">
      <PageHeader title="FAQs" description="Manage frequently asked questions shown on the site.">
        <Button onClick={openCreate}>+ Add FAQ</Button>
      </PageHeader>

      <DataTable
        data={data} searchKeys={["question"]} emptyMessage={loading ? "Loading FAQs..." : "No FAQs yet."}
        columns={[
          { key: "question",  label: "Question", render: (r) => <span className="font-bold text-[#062f36] max-w-sm block truncate">{r.question}</span> },
          { key: "answer",    label: "Answer",   render: (r) => <span className="text-[#62777d] max-w-xs block truncate">{r.answer}</span> },
          { key: "is_active", label: "Status",   render: (r) => <Badge color={r.is_active ? "teal" : "gray"}>{r.is_active ? "Active" : "Hidden"}</Badge> },
          { key: "sort_order",label: "Order",    width: "70px" },
        ]}
        actions={(r) => (
          <>
            <button onClick={() => openEdit(r)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#0f6b72] hover:bg-[#0f6b72]/10 transition-all"><Pencil size={15} /></button>
            <button onClick={() => setDeleteId(r._id || r.id || null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 transition-all"><Trash2 size={15} /></button>
          </>
        )}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? "Edit FAQ" : "Add FAQ"} size="lg">
        <div className="space-y-4">
          <Textarea label="Question" required rows={2} value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
          <Textarea label="Answer" required rows={5} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Sort Order" type="number" value={String(form.sort_order)} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
            <div className="flex items-end pb-1"><Toggle checked={form.is_active} onChange={(v) => setForm({ ...form, is_active: v })} label="Active" /></div>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-[#dbe7e9]">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editId ? "Update" : "Add"} FAQ</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} message="This will permanently delete the FAQ." />
    </div>
  );
}
