"use client";
import { useState, useEffect } from "react";
import { Pencil, Trash2, Star, Upload, Globe } from "lucide-react";
import toast from "react-hot-toast";
import { createProjectServices, type Review, type ReviewPayload } from "@/app/services/contentServices";
import { api, getApiAssetUrl } from "@/app/lib/api";
import { useProject } from "@/app/context/ProjectContext";
import PageHeader from "@/app/components/ui/PageHeader";
import DataTable from "@/app/components/ui/DataTable";
import Modal from "@/app/components/ui/Modal";
import ConfirmDialog from "@/app/components/ui/ConfirmDialog";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import Textarea from "@/app/components/ui/Textarea";
import Toggle from "@/app/components/ui/Toggle";
import Badge from "@/app/components/ui/Badge";
import Select from "@/app/components/ui/Select";
import Link from "next/link";

type ReviewForm = ReviewPayload;
const empty: ReviewForm = { name: "", date: "", review_title: "", review_body: "", stars: 5, is_active: true, sort_order: 0 };

export default function ReviewsPage() {
  const { selectedProject } = useProject();
  const [data, setData] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [form, setForm] = useState<ReviewForm>(empty);
  const [editId, setEditId] = useState<string | number | null>(null);
  const [uploading, setUploading] = useState(false);

  const svc = selectedProject ? createProjectServices(selectedProject.apiPrefix).reviews : null;

  const fetchData = async () => {
    if (!svc) return;
    try {
      setLoading(true);
      setData(await svc.list());
    } catch {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [selectedProject]);

  const openCreate = () => { setForm(empty); setEditId(null); setModalOpen(true); };
  const openEdit = (r: Review) => { const { _id, id, ...rest } = r; setForm(rest); setEditId(_id || id || ""); setModalOpen(true); };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      // selectedProject.apiPrefix pass karo taake sahi folder mein save ho
      const result = await api.upload(file, selectedProject?.apiPrefix || "spouse-visa");
      setForm({ ...form, image: result.path });
      toast.success("Image uploaded!");
    } catch { toast.error("Failed to upload image"); }
    finally { setUploading(false); }
  };

  const handleSave = async () => {
    if (!svc) return;
    if (!form.name || !form.review_body) return toast.error("Name and review body are required.");
    try {
      if (editId) { await svc.update(editId, form); toast.success("Review updated!"); }
      else        { await svc.create(form);          toast.success("Review added!"); }
      setModalOpen(false);
      fetchData();
    } catch { toast.error("Failed to save review"); }
  };

  const handleDelete = async () => {
    if (!svc || !deleteId) return;
    try {
      await svc.remove(deleteId);
      toast.success("Review deleted.");
      setDeleteId(null);
      fetchData();
    } catch { toast.error("Failed to delete review"); }
  };

  const Stars = ({ n, reviewId }: { n: number; reviewId: string | number }) => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={`star-${reviewId}-${i}`} size={13} className={i < n ? "fill-[#f4c400] text-[#f4c400]" : "fill-slate-200 text-slate-200"} />
      ))}
    </div>
  );

  if (!selectedProject) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-[#0f6b72]/10 flex items-center justify-center mb-4">
          <Globe size={32} className="text-[#0f6b72]" />
        </div>
        <h2 className="text-xl font-black text-[#062f36] mb-2">No project selected</h2>
        <p className="text-[#62777d] mb-6">Choose a project first to manage its reviews.</p>
        <Link href="/dashboard/projects" className="px-4 py-2 rounded-xl bg-[#0f6b72] text-white text-sm font-bold hover:bg-[#062f36] transition-colors">Go to Projects</Link>
      </div>
    );
  }

  return (
    <div className="animate-fadein space-y-6">
      <PageHeader title="Reviews" description={`Manage client testimonials for ${selectedProject.name}.`}>
        <Button onClick={openCreate}>+ Add Review</Button>
      </PageHeader>

      <DataTable
        data={data} searchKeys={["name", "review_title"]} emptyMessage="No reviews yet."
        columns={[
          { key: "name", label: "Reviewer", render: (r) => (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-[#dbe7e9] bg-slate-100 flex-shrink-0">
                {r.image ? (
                  <img src={getApiAssetUrl(r.image) || ""} alt={r.name} className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(r.name)}&background=0f6b72&color=fff`; }} />
                ) : (
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(r.name)}&background=0f6b72&color=fff`} alt={r.name} className="w-full h-full object-cover" />
                )}
              </div>
              <span className="font-bold text-[#062f36]">{r.name}</span>
            </div>
          )},
          { key: "review_title", label: "Title",  render: (r) => <span className="max-w-[200px] block truncate">{r.review_title}</span> },
          { key: "stars",        label: "Stars",  render: (r) => <Stars n={r.stars} reviewId={r._id || r.id || ""} /> },
          { key: "is_active",    label: "Status", render: (r) => <Badge color={r.is_active ? "teal" : "gray"}>{r.is_active ? "Active" : "Hidden"}</Badge> },
          { key: "sort_order",   label: "Order",  width: "70px" },
        ]}
        actions={(r) => {
          const rowId = r._id || r.id || "";
          return [
            <button key={`edit-${rowId}`} onClick={() => openEdit(r)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#0f6b72] hover:bg-[#0f6b72]/10 transition-all"><Pencil size={15} /></button>,
            <button key={`del-${rowId}`}  onClick={() => setDeleteId(rowId)} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 transition-all"><Trash2 size={15} /></button>,
          ];
        }}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? "Edit Review" : "Add Review"} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Reviewer Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <Input label="Review Title" value={form.review_title} onChange={(e) => setForm({ ...form, review_title: e.target.value })} />
          <Textarea label="Review Body" required rows={5} value={form.review_body} onChange={(e) => setForm({ ...form, review_body: e.target.value })} />
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#062f36]">Reviewer Image</label>
            {form.image && <img src={getApiAssetUrl(form.image) || ""} alt="Preview" className="w-24 h-24 object-cover rounded-xl border border-[#dbe7e9]" />}
            <div className="flex items-center gap-3">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="review-image-upload" />
              <Button variant="secondary" onClick={() => document.getElementById("review-image-upload")?.click()} disabled={uploading}>
                <Upload size={16} className="mr-2" />{uploading ? "Uploading..." : "Upload Image"}
              </Button>
              {form.image && <Button variant="secondary" onClick={() => setForm({ ...form, image: undefined })}>Remove Image</Button>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Select label="Stars" value={String(form.stars)} onChange={(e) => setForm({ ...form, stars: Number(e.target.value) })}
              options={[1,2,3,4,5].map((n) => ({ value: String(n), label: `${n} Star${n > 1 ? "s" : ""}` }))} />
            <Input label="Sort Order" type="number" value={String(form.sort_order)} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
            <div className="flex items-end pb-1"><Toggle checked={form.is_active} onChange={(v) => setForm({ ...form, is_active: v })} label="Active" /></div>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-[#dbe7e9]">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editId ? "Update" : "Add"} Review</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} message="This will permanently delete the review." />
    </div>
  );
}
