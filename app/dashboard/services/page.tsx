"use client";
import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { homeServicesService, type HomeService, type HomeServicePayload } from "@/app/services/contentServices";
import PageHeader from "@/app/components/ui/PageHeader";
import DataTable from "@/app/components/ui/DataTable";
import Modal from "@/app/components/ui/Modal";
import ConfirmDialog from "@/app/components/ui/ConfirmDialog";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import Textarea from "@/app/components/ui/Textarea";
import Toggle from "@/app/components/ui/Toggle";
import Badge from "@/app/components/ui/Badge";

type ServiceForm = HomeServicePayload;
const empty: ServiceForm = { title: "", text: "", is_active: true, sort_order: 0 };

export default function ServicesPage() {
  const [data, setData] = useState<HomeService[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [form, setForm] = useState<ServiceForm>(empty);
  const [editId, setEditId] = useState<string | number | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const services = await homeServicesService.list();
      setData(services);
    } catch (error) {
      toast.error("Failed to load services");
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
  
  const openEdit = (r: HomeService) => { 
    const { _id, id, ...rest } = r; 
    setForm(rest); 
    // Fallback provided to satisfy TypeScript's strict check
    setEditId(_id || id || null); 
    setModalOpen(true); 
  };

  const handleSave = async () => {
    if (!form.title) return toast.error("Title is required.");
    try {
      if (editId) {
        await homeServicesService.update(editId, form);
        toast.success("Service updated!");
      } else {
        await homeServicesService.create(form);
        toast.success("Service added!");
      }
      setModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to save service");
    }
  };

  const handleDelete = async () => {
    try {
      if (!deleteId) return;
      await homeServicesService.remove(deleteId);
      toast.success("Deleted.");
      setDeleteId(null);
      fetchData();
    } catch (error) {
      toast.error("Failed to delete service");
    }
  };

  return (
    <div className="animate-fadein space-y-6">
      <PageHeader title="Services" description="Manage the visa services listed on the site.">
        <Button onClick={openCreate}>+ Add Service</Button>
      </PageHeader>

      <DataTable
        data={data} searchKeys={["title"]} emptyMessage="No services yet."
        columns={[
          { key: "title",      label: "Title",       render: (r) => <span className="font-bold text-[#062f36]">{r.title}</span> },
          { key: "text",       label: "Description", render: (r) => <span className="max-w-xs truncate text-[#62777d]">{r.text}</span> },
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? "Edit Service" : "Add Service"} size="lg">
        <div className="space-y-4">
          <Input label="Title" required value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Textarea label="Description" rows={3} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Sort Order" type="number" value={String(form.sort_order)} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
            <div className="flex items-end pb-1"><Toggle checked={form.is_active} onChange={(v) => setForm({ ...form, is_active: v })} label="Active" /></div>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-[#dbe7e9]">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editId ? "Update" : "Add"} Service</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} message="This will permanently delete the service." />
    </div>
  );
}