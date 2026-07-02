"use client";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { type TeamMember, type TeamMemberPayload } from "@/app/services/contentServices";
import PageHeader from "@/app/components/ui/PageHeader";
import DataTable from "@/app/components/ui/DataTable";
import Modal from "@/app/components/ui/Modal";
import ConfirmDialog from "@/app/components/ui/ConfirmDialog";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import Textarea from "@/app/components/ui/Textarea";
import Toggle from "@/app/components/ui/Toggle";
import Badge from "@/app/components/ui/Badge";

type Member = TeamMember;
type MemberForm = TeamMemberPayload;
const empty: MemberForm = { name: "", role: "", bio: "", email: "", phone: "", is_active: true, sort_order: 0 };
const initials = (name?: string | null) => {
  if (!name) return "??";
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
};

// Dummy data for team members
const dummyTeamMembers: TeamMember[] = [
  { id: "1", name: "John Doe", role: "Immigration Solicitor", bio: "Expert in UK spouse visa applications", email: "john@msd.com", phone: "0161 123 4567", is_active: true, sort_order: 1 },
  { id: "2", name: "Jane Smith", role: "Case Manager", bio: "Specializes in document preparation", email: "jane@msd.com", phone: "0161 765 4321", is_active: true, sort_order: 2 },
];

export default function TeamPage() {
  const [data, setData] = useState<Member[]>(dummyTeamMembers);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [form, setForm] = useState<MemberForm>(empty);
  const [editId, setEditId] = useState<string | number | null>(null);
  const [nextId, setNextId] = useState(3);

  const openCreate = () => { setForm(empty); setEditId(null); setModalOpen(true); };
  
  const openEdit = (r: Member) => { 
    const { _id, id, ...rest } = r; 
    setForm(rest); 
    // FIX: Fallback to null to handle strict type safety boundary
    setEditId(_id || id || null); 
    setModalOpen(true); 
  };

  const handleSave = () => {
    if (!form.name) return toast.error("Name is required.");
    try {
      if (editId) {
        setData(data.map(m => m.id === editId || m._id === editId ? { ...m, ...form } : m));
        toast.success("Member updated!");
      } else {
        setData([...data, { ...form, id: nextId.toString(), _id: nextId.toString() }]);
        setNextId(nextId + 1);
        toast.success("Member added!");
      }
      setModalOpen(false);
    } catch (error) {
      toast.error("Failed to save team member");
    }
  };

  const handleDelete = () => {
    try {
      if (!deleteId) return;
      setData(data.filter(m => m.id !== deleteId && m._id !== deleteId));
      toast.success("Deleted.");
      setDeleteId(null);
    } catch (error) {
      toast.error("Failed to delete team member");
    }
  };

  return (
    <div className="animate-fadein space-y-6">
      <PageHeader title="Team Members" description="Manage the solicitors and staff profiles shown on the site.">
        <Button onClick={openCreate}>+ Add Member</Button>
      </PageHeader>

      <DataTable
        data={data} searchKeys={["name", "role"]} emptyMessage="No team members yet."
        columns={[
          {
            key: "name", label: "Member",
            render: (r) => (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0f6b72] to-[#062f36] flex items-center justify-center text-white font-black text-xs shrink-0">{initials(r.name)}</div>
                <div><p className="font-bold text-[#062f36]">{r.name}</p><p className="text-xs text-[#62777d]">{r.role}</p></div>
              </div>
            ),
          },
          { key: "email",      label: "Email", render: (r) => <span className="text-xs text-[#62777d]">{r.email || "—"}</span> },
          { key: "phone",      label: "Phone", render: (r) => <span className="text-xs text-[#62777d]">{r.phone || "—"}</span> },
          { key: "is_active",  label: "Status", render: (r) => <Badge color={r.is_active ? "teal" : "gray"}>{r.is_active ? "Active" : "Hidden"}</Badge> },
          { key: "sort_order", label: "Order", width: "70px" },
        ]}
        actions={(r) => (
          <>
            <button onClick={() => openEdit(r)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#0f6b72] hover:bg-[#0f6b72]/10 transition-all"><Pencil size={15} /></button>
            {/* FIX: Use fallback assignment for target delete context mapping */}
            <button onClick={() => setDeleteId(r._id || r.id || null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 transition-all"><Trash2 size={15} /></button>
          </>
        )}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? "Edit Member" : "Add Member"} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Role / Title" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. Immigration Solicitor" />
          </div>
          <Textarea label="Bio" rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="Phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Sort Order" type="number" value={String(form.sort_order)} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
            <div className="flex items-end pb-1"><Toggle checked={form.is_active} onChange={(v) => setForm({ ...form, is_active: v })} label="Active" /></div>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-[#dbe7e9]">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editId ? "Update" : "Add"} Member</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} message="This will permanently delete this team member." />
    </div>
  );
}