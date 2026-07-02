"use client";
import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { usersService, type CmsUser, type CmsUserPayload } from "@/app/services/contentServices";
import PageHeader from "@/app/components/ui/PageHeader";
import DataTable from "@/app/components/ui/DataTable";
import Modal from "@/app/components/ui/Modal";
import ConfirmDialog from "@/app/components/ui/ConfirmDialog";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import Select from "@/app/components/ui/Select";
import Badge from "@/app/components/ui/Badge";

interface UserForm {
  name: string;
  email: string;
  role: string;
  password: string;
}

const empty: UserForm = { name: "", email: "", role: "editor", password: "" };
const initials = (name: string) => name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

export default function UsersPage() {
  const [data, setData] = useState<CmsUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [form, setForm] = useState<UserForm>(empty);
  const [editId, setEditId] = useState<string | number | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const users = await usersService.list();
      setData(users);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => { setForm(empty); setEditId(null); setModalOpen(true); };
  const openEdit = (r: CmsUser) => { setForm({ name: r.name, email: r.email, role: r.role, password: "" }); setEditId(r._id || r.id); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.name || !form.email) return toast.error("Name and email are required.");
    if (!editId && !form.password) return toast.error("Password is required.");
    try {
      if (editId) {
        const payload: CmsUserPayload = { name: form.name, email: form.email, role: form.role };
        if (form.password) payload.password = form.password;
        await usersService.update(editId, payload);
        toast.success("User updated!");
      } else {
        await usersService.create(form);
        toast.success("User created!");
      }
      setModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to save user");
    }
  };

  const handleDelete = async () => {
    try {
      if (!deleteId) return;
      await usersService.remove(deleteId);
      toast.success("User deleted.");
      setDeleteId(null);
      fetchData();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const fmt = (dt: string) => new Date(dt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="animate-fadein space-y-6">
      <PageHeader title="Users" description="Manage CMS admin and editor accounts.">
        <Button onClick={openCreate}>+ Add User</Button>
      </PageHeader>

      <DataTable
        data={data} searchKeys={["name", "email"]} emptyMessage="No users found."
        columns={[
          {
            key: "name", label: "User",
            render: (r) => (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0f6b72] to-[#062f36] flex items-center justify-center text-white font-black text-xs shrink-0">{initials(r.name)}</div>
                <div><p className="font-bold text-[#062f36]">{r.name}</p><p className="text-xs text-[#62777d]">{r.email}</p></div>
              </div>
            ),
          },
          { key: "role",       label: "Role",   render: (r) => <Badge color={r.role === "admin" ? "orange" : "teal"}>{r.role === "admin" ? "👑 Admin" : "✏️ Editor"}</Badge> },
          { key: "created_at", label: "Joined", render: (r) => <span className="text-xs text-[#62777d]">{fmt(r.created_at || r.createdAt || "")}</span> },
        ]}
        actions={(r) => (
          <>
            <button onClick={() => openEdit(r)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#0f6b72] hover:bg-[#0f6b72]/10 transition-all"><Pencil size={15} /></button>
            <button onClick={() => setDeleteId(r._id || r.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 transition-all"><Trash2 size={15} /></button>
          </>
        )}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? "Edit User" : "Add User"}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Email Address" required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <Select label="Role" required value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
            options={[{ value: "admin", label: "Admin — Full Access" }, { value: "editor", label: "Editor — Content Only" }]} />
          <Input
            label={editId ? "New Password (leave blank to keep)" : "Password"}
            type="password" required={!editId}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Min. 8 characters"
          />
          <div className="flex justify-end gap-3 pt-2 border-t border-[#dbe7e9]">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editId ? "Update" : "Create"} User</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete User?" message="This will permanently delete the user account." />
    </div>
  );
}
