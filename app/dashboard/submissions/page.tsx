"use client";
import { useState, useEffect } from "react";
import { Eye, Trash2, Mail, Phone, User, Clock, MessageSquare, Globe } from "lucide-react";
import toast from "react-hot-toast";
import { submissionsService, type Submission } from "@/app/services/contentServices";
import PageHeader from "@/app/components/ui/PageHeader";
import DataTable from "@/app/components/ui/DataTable";
import Modal from "@/app/components/ui/Modal";
import ConfirmDialog from "@/app/components/ui/ConfirmDialog";
import Button from "@/app/components/ui/Button";
import Badge from "@/app/components/ui/Badge";
import Select from "@/app/components/ui/Select";
import Textarea from "@/app/components/ui/Textarea";
import Card from "@/app/components/ui/Card";

// Define a literal type aligned with service layer
type SubmissionStatus = "new" | "read" | "replied" | "archived";

const statusColors: Record<SubmissionStatus, "red" | "gold" | "green" | "gray"> = {
  new: "red",
  read: "gold",
  replied: "green",
  archived: "gray",
};

export default function SubmissionsPage() {
  const [data, setData] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewItem, setViewItem] = useState<Submission | null>(null);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [filterStatus, setFilterStatus] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const submissions = await submissionsService.list();
      setData(submissions);
    } catch (error) {
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const newCount = data.filter((d) => d.status === "new").length;
  const filtered = filterStatus ? data.filter((d) => d.status === filterStatus) : data;

  const handleView = async (r: Submission) => {
    setViewItem(r);
    if (r.status === "new") {
      try {
        const id = r._id || r.id;
        if (!id) return;
        // Typecast status explicitly to ensure strict compliance
        await submissionsService.updateStatus(id, { status: "read" as SubmissionStatus, notes: r.notes || "" });
        fetchData();
      } catch (error) {
        toast.error("Failed to update status");
      }
    }
  };

  const handleSaveView = async (id: string | number, status: string, notes: string) => {
    try {
      // FIX: Assert 'status' as SubmissionStatus to fulfill contract type constraint
      await submissionsService.updateStatus(id, { status: status as SubmissionStatus, notes });
      toast.success("Updated!");
      setViewItem(null);
      fetchData();
    } catch (error) {
      toast.error("Failed to save changes");
    }
  };

  const handleDelete = async () => {
    try {
      if (!deleteId) return;
      await submissionsService.remove(deleteId);
      toast.success("Deleted.");
      setDeleteId(null);
      fetchData();
    } catch (error) {
      toast.error("Failed to delete submission");
    }
  };

  const fmtDate = (dt?: string) =>
    dt ? new Date(dt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";

  return (
    <div className="animate-fadein space-y-6">
      <PageHeader
        title={
          <span className="flex items-center gap-3">
            Enquiries
            {newCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-red-500 text-white">
                {newCount} new
              </span>
            )}
          </span> as any
        }
        description="View and manage contact form submissions from all your websites."
      >
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="h-9 px-3 rounded-xl border border-[#dbe7e9] bg-white text-sm font-bold text-[#062f36] outline-none focus:border-[#0f6b72] cursor-pointer"
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="archived">Archived</option>
        </select>
      </PageHeader>

      <DataTable
        data={filtered}
        searchKeys={["name", "email", "service"]}
        emptyMessage="No enquiries yet."
        columns={[
          {
            key: "name",
            label: "From",
            render: (r) => {
              const rowId = r._id || r.id || "sub";
              return (
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0f6b72] to-[#062f36] flex items-center justify-center text-white text-xs font-black shrink-0">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-[#062f36]">{r.name}</p>
                    <p className="text-xs text-[#62777d]">{r.email}</p>
                  </div>
                </div>
              );
            },
          },
          { key: "phone",   label: "Phone",   render: (r) => <span className="text-sm text-[#62777d]">{r.phone || "—"}</span> },
          { key: "service", label: "Service", render: (r) => <span className="text-sm text-[#062f36] max-w-[150px] block truncate">{r.service || "—"}</span> },
          { key: "status",  label: "Status",  render: (r) => <Badge color={statusColors[r.status as SubmissionStatus] || "gray"}>{r.status}</Badge> },
          { key: "source",  label: "Source",  render: (r) => <span className="text-xs text-slate-400">{r.source || "—"}</span> },
          { key: "createdAt", label: "Date",  render: (r) => <span className="text-xs text-[#62777d]">{fmtDate(r.createdAt)}</span> },
        ]}
        actions={(r) => {
          const rowId = r._id || r.id || "";
          return [
            <button
              key={`view-btn-${rowId}`}
              onClick={() => handleView(r)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#0f6b72] hover:bg-[#0f6b72]/10 transition-all"
            >
              <Eye size={15} />
            </button>,
            <button
              key={`delete-btn-${rowId}`}
              onClick={() => { if (rowId) setDeleteId(rowId); }}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 transition-all"
            >
              <Trash2 size={15} />
            </button>,
          ];
        }}
      />

      {viewItem && (
        <ViewModal item={viewItem} onClose={() => setViewItem(null)} onSave={handleSaveView} />
      )}

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        message="This will permanently delete this enquiry."
      />
    </div>
  );
}

function ViewModal({
  item,
  onClose,
  onSave,
}: {
  item: Submission;
  onClose: () => void;
  onSave: (id: string | number, status: string, notes: string) => void;
}) {
  const [status, setStatus] = useState(item.status);
  const [notes, setNotes] = useState(item.notes || "");

  const Row = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) =>
    value ? (
      <div className="flex items-start gap-3 py-2.5 border-b border-[#dbe7e9]/60 last:border-0">
        <div className="w-7 h-7 rounded-lg bg-[#0f6b72]/10 flex items-center justify-center shrink-0 mt-0.5">
          <Icon size={13} className="text-[#0f6b72]" />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{label}</p>
          <p className="text-sm font-semibold text-[#062f36] mt-0.5 leading-relaxed">{value}</p>
        </div>
      </div>
    ) : null;

  return (
    <Modal open={true} onClose={onClose} title="Enquiry Details" size="lg">
      <div className="space-y-5">
        <Card className="p-4">
          <Row icon={User}          label="Name"        value={item.name} />
          <Row icon={Mail}          label="Email"       value={item.email} />
          <Row icon={Phone}         label="Phone"       value={item.phone} />
          <Row icon={Globe}         label="Service"     value={item.service} />
          <Row icon={User}          label="Nationality" value={item.nationality} />
          <Row icon={MessageSquare} label="Message"     value={item.message} />
          <Row icon={Clock}         label="Submitted"   value={item.createdAt ? new Date(item.createdAt).toLocaleString("en-GB") : ""} />
        </Card>
        <div className="space-y-3">
          <Select
            label="Update Status"
            value={status}
            // FIX: Explicitly cast e.target.value as SubmissionStatus to satisfy literal union constraint
            onChange={(e) => setStatus(e.target.value as SubmissionStatus)}
            options={[
              { value: "new",      label: "New" },
              { value: "read",     label: "Read" },
              { value: "replied",  label: "Replied" },
              { value: "archived", label: "Archived" },
            ]}
          />
          <Textarea
            label="Internal Notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this enquiry..."
          />
        </div>
        <div className="flex justify-end gap-3 pt-2 border-t border-[#dbe7e9]">
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <Button onClick={() => onSave(item._id || item.id || "", status, notes)}>Save Changes</Button>
        </div>
      </div>
    </Modal>
  );
}