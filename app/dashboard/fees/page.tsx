"use client";
import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { feesService, type Fee, type FeePayload } from "@/app/services/contentServices";
import PageHeader from "@/app/components/ui/PageHeader";
import DataTable from "@/app/components/ui/DataTable";
import Modal from "@/app/components/ui/Modal";
import ConfirmDialog from "@/app/components/ui/ConfirmDialog";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import Toggle from "@/app/components/ui/Toggle";
import Badge from "@/app/components/ui/Badge";
import Select from "@/app/components/ui/Select";

type FeeForm = FeePayload;
const empty: FeeForm = { label: "", price: "", category: "personal", is_main: false, is_active: true, sort_order: 0 };

const catColors: Record<string, "teal" | "gold" | "orange"> = { personal: "teal", business: "gold", appeals: "orange" };

export default function FeesPage() {
  const [data, setData] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [form, setForm] = useState<FeeForm>(empty);
  const [editId, setEditId] = useState<string | number | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const fees = await feesService.list();
      setData(fees);
    } catch (error) {
      toast.error("Failed to load fees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => { setForm(empty); setEditId(null); setModalOpen(true); };
  const openEdit = (r: Fee) => { const { _id, id, ...rest } = r; setForm(rest); setEditId(_id || id); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.label || !form.price) return toast.error("Label and price are required.");
    try {
      if (editId) {
        await feesService.update(editId, form);
        toast.success("Fee updated!");
      } else {
        await feesService.create(form);
        toast.success("Fee added!");
      }
      setModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to save fee");
    }
  };

  const handleDelete = async () => {
    try {
      if (!deleteId) return;
      await feesService.remove(deleteId);
      toast.success("Deleted.");
      setDeleteId(null);
      fetchData();
    } catch (error) {
      toast.error("Failed to delete fee");
    }
  };

  return (
    <div className="animate-fadein space-y-6">
      <PageHeader title="Fees" description="Manage visa service fee schedule — personal, business and appeals.">
        <Button onClick={openCreate}>+ Add Fee</Button>
      </PageHeader>

      <DataTable
        data={data} searchKeys={["label"]} emptyMessage="No fees yet."
        columns={[
          { key: "label",      label: "Service",     render: (r) => <span className="font-bold text-[#062f36]">{r.label}</span> },
          { key: "price",      label: "Price",       render: (r) => <span className="font-black text-[#0f6b72]">{r.price}</span> },
          { key: "category",   label: "Category",    render: (r) => <Badge color={catColors[r.category] || "gray"}>{r.category}</Badge> },
          { key: "is_main",    label: "Highlighted", render: (r) => r.is_main ? <Badge color="gold">⭐ Main</Badge> : <span className="text-slate-300 text-xs">—</span> },
          { key: "is_active",  label: "Status",      render: (r) => <Badge color={r.is_active ? "teal" : "gray"}>{r.is_active ? "Active" : "Hidden"}</Badge> },
          { key: "sort_order", label: "Order",       width: "70px" },
        ]}
        actions={(r) => (
          <>
            <button onClick={() => openEdit(r)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#0f6b72] hover:bg-[#0f6b72]/10 transition-all"><Pencil size={15} /></button>
            <button onClick={() => setDeleteId(r.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 transition-all"><Trash2 size={15} /></button>
          </>
        )}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? "Edit Fee" : "Add Fee"} size="md">
        <div className="space-y-4">
          <Input label="Service Label" required value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="e.g. Entry Clearance/Spouse Visa" />
          <Input label="Price" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="e.g. £800 - £1,500" />
          <Select label="Category" required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
            options={[{ value: "personal", label: "Personal Immigration" }, { value: "business", label: "Business Immigration" }, { value: "appeals", label: "Appeals & Specialized" }]} />
          <div className="grid grid-cols-3 gap-4">
            <Input label="Sort Order" type="number" value={String(form.sort_order)} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
            <div className="flex items-end pb-1"><Toggle checked={form.is_main} onChange={(v) => setForm({ ...form, is_main: v })} label="Highlighted" /></div>
            <div className="flex items-end pb-1"><Toggle checked={form.is_active} onChange={(v) => setForm({ ...form, is_active: v })} label="Active" /></div>
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
