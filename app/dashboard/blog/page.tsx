"use client";
import { useState, useEffect } from "react";
import { Pencil, Trash2, Globe, Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import { createProjectServices, type BlogPost, type BlogPostPayload, type BlogSection } from "@/app/services/contentServices";
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
import Link from "next/link";
import { api, getApiAssetUrl } from "@/app/lib/api";

type BlogForm = BlogPostPayload;
const emptyBlogSection: BlogSection = { type: "intro", heading: "", text: "", items: [], cards: [] };
const empty: BlogForm = { 
  slug: "", 
  title: "", 
  excerpt: "", 
  date: new Date().toISOString().split('T')[0], 
  category: "", 
  image: "", 
  content: [emptyBlogSection], 
  is_active: true, 
  sort_order: 0 
};

export default function BlogPage() {
  const { selectedProject } = useProject();
  const [data, setData] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [form, setForm] = useState<BlogForm>(empty);
  const [editId, setEditId] = useState<string | number | null>(null);
  const [uploading, setUploading] = useState(false);

  const svc = selectedProject ? createProjectServices(selectedProject.apiPrefix).blogPosts : null;

  const fetchData = async () => {
    if (!svc) return;
    try {
      setLoading(true);
      setData(await svc.list());
    } catch { toast.error("Failed to load blog posts"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [selectedProject]);

  const openCreate = () => { setForm(empty); setEditId(null); setModalOpen(true); };
  const openEdit = (r: BlogPost) => { 
    const { _id, id, ...rest } = r; 
    // Ensure content is always an array
    const safeRest = { ...rest, content: rest.content || [emptyBlogSection] };
    setForm(safeRest); 
    setEditId(_id || id || null); 
    setModalOpen(true); 
  };

  const handleSave = async () => {
    if (!svc) return;
    if (!form.title) return toast.error("Title is required.");
    if (!form.slug) return toast.error("Slug is required.");
    try {
      if (editId) { await svc.update(editId, form); toast.success("Updated!"); }
      else        { await svc.create(form);          toast.success("Added!"); }
      setModalOpen(false);
      fetchData();
    } catch { toast.error("Failed to save blog post"); }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedProject || !e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    try {
      setUploading(true);
      const result = await api.upload(file, selectedProject.apiPrefix, "blog");
      setForm(prev => ({ ...prev, image: result.path }));
      toast.success("Image uploaded!");
    } catch (err) {
      toast.error((err as Error).message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!svc || !deleteId) return;
    try {
      await svc.remove(deleteId);
      toast.success("Deleted.");
      setDeleteId(null);
      fetchData();
    } catch { toast.error("Failed to delete blog post"); }
  };

  if (!selectedProject) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-[#0f6b72]/10 flex items-center justify-center mb-4"><Globe size={32} className="text-[#0f6b72]" /></div>
        <h2 className="text-xl font-black text-[#062f36] mb-2">No project selected</h2>
        <p className="text-[#62777d] mb-6">Choose a project first to manage its blog posts.</p>
        <Link href="/dashboard/projects" className="px-4 py-2 rounded-xl bg-[#0f6b72] text-white text-sm font-bold hover:bg-[#062f36] transition-colors">Go to Projects</Link>
      </div>
    );
  }

  return (
    <div className="animate-fadein space-y-6">
      <PageHeader title="Blog Posts" description={`Manage blog articles for ${selectedProject.name}.`}>
        <Button onClick={openCreate}>+ Add Blog Post</Button>
      </PageHeader>

      <DataTable
        data={data} searchKeys={["title", "category", "slug"]} emptyMessage="No blog posts yet."
        columns={[
          { key: "title",     label: "Title",     render: (r) => <span className="font-bold text-[#062f36]">{r.title}</span> },
          { key: "category",  label: "Category" },
          { key: "date",      label: "Date" },
          { key: "is_active", label: "Status",    render: (r) => <Badge color={r.is_active ? "teal" : "gray"}>{r.is_active ? "Active" : "Hidden"}</Badge> },
          { key: "sort_order", label: "Order",    width: "70px" },
        ]}
        actions={(r) => (
          <>
            <button onClick={() => openEdit(r)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#0f6b72] hover:bg-[#0f6b72]/10 transition-all"><Pencil size={15} /></button>
            <button onClick={() => setDeleteId(r._id || r.id || null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 transition-all"><Trash2 size={15} /></button>
          </>
        )}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? "Edit Blog Post" : "Add Blog Post"}>
        <div className="space-y-4">
          <Input label="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input label="Slug" required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <Textarea label="Excerpt" rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <Input label="Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#062f36]">Blog Image</label>
            {form.image && (
              <div className="relative w-full max-w-xs">
                <img 
                  src={getApiAssetUrl(form.image)} 
                  alt="Preview" 
                  className="w-full h-40 object-cover rounded-xl border border-[#dbe7e9]"
                />
                <button 
                  onClick={() => setForm(prev => ({ ...prev, image: "" }))}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                >
                  <X size={12} />
                </button>
              </div>
            )}
            <div className="flex items-center gap-3">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden" 
                id="blog-image-upload"
              />
              <label 
                htmlFor="blog-image-upload" 
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#0f6b72] text-[#0f6b72] text-sm font-bold hover:bg-[#0f6b72]/10 cursor-pointer transition-colors"
              >
                <Upload size={16} />
                {uploading ? "Uploading..." : "Upload Image"}
              </label>
              <span className="text-xs text-[#62777d]">OR enter path manually:</span>
            </div>
            <Input 
              value={form.image} 
              onChange={(e) => setForm({ ...form, image: e.target.value })} 
              placeholder="e.g. /assets/spouse-visa/images/blog/..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Sort Order" type="number" value={String(form.sort_order)} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
            <div className="flex items-end pb-1"><Toggle checked={form.is_active} onChange={(v) => setForm({ ...form, is_active: v })} label="Active" /></div>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-[#dbe7e9]">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editId ? "Update" : "Add"} Blog Post</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} message="This will permanently delete this blog post." />
    </div>
  );
}
