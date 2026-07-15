"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Save, Pencil, X, MessageSquare, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { chatFlowService, type ChatNode, type ChatOption } from "@/app/services/chatFlowService";
import PageHeader from "@/app/components/ui/PageHeader";
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";
import Badge from "@/app/components/ui/Badge";
import Modal from "@/app/components/ui/Modal";
import Input from "@/app/components/ui/Input";
import Textarea from "@/app/components/ui/Textarea";
import Toggle from "@/app/components/ui/Toggle";
import Select from "@/app/components/ui/Select";
import ConfirmDialog from "@/app/components/ui/ConfirmDialog";

const typeColors: Record<string, "teal" | "gold" | "green" | "gray" | "red"> = {
  start:    "teal",
  question: "gold",
  answer:   "green",
  contact:  "gray",
};

const typeLabels: Record<string, string> = {
  start:    "Start",
  question: "Question",
  answer:   "Answer",
  contact:  "Contact",
};

const emptyNode = (): Omit<ChatNode, "_id" | "id"> => ({
  type: "question",
  message: "",
  options: [],
  is_active: true,
  sort_order: 0,
});

export default function ChatbotPage() {
  const [nodes, setNodes] = useState<ChatNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editNode, setEditNode] = useState<ChatNode | null>(null);
  const [form, setForm] = useState(emptyNode());
  const [newOptionLabel, setNewOptionLabel] = useState("");
  const [newOptionNext, setNewOptionNext] = useState<string>("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await chatFlowService.list();
      setNodes(data.sort((a, b) => a.sort_order - b.sort_order));
    } catch {
      toast.error("Failed to load chatbot flow");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditNode(null);
    setForm(emptyNode());
    setNewOptionLabel("");
    setNewOptionNext("");
    setModalOpen(true);
  };

  const openEdit = (node: ChatNode) => {
    setEditNode(node);
    const { _id, id, ...rest } = node;
    setForm(rest);
    setNewOptionLabel("");
    setNewOptionNext("");
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.message.trim()) return toast.error("Message is required.");
    try {
      const id = editNode?._id || editNode?.id;
      if (id) {
        await chatFlowService.update(id, form);
        toast.success("Node updated!");
      } else {
        await chatFlowService.create(form);
        toast.success("Node created!");
      }
      setModalOpen(false);
      fetchData();
    } catch {
      toast.error("Failed to save node");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await chatFlowService.remove(deleteId);
      toast.success("Deleted.");
      setDeleteId(null);
      fetchData();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const addOption = () => {
    if (!newOptionLabel.trim()) return toast.error("Option label is required.");
    setForm((prev) => ({
      ...prev,
      options: [...prev.options, { label: newOptionLabel.trim(), next_id: newOptionNext || null }],
    }));
    setNewOptionLabel("");
    setNewOptionNext("");
  };

  const removeOption = (idx: number) => {
    setForm((prev) => ({ ...prev, options: prev.options.filter((_, i) => i !== idx) }));
  };

  const nodeLabel = (id: string | null) => {
    if (!id) return "End conversation";
    const n = nodes.find((x) => (x._id || x.id) === id);
    return n ? `${typeLabels[n.type]}: ${n.message.slice(0, 40)}…` : id;
  };

  const nodeOptions = [
    { value: "", label: "— End conversation —" },
    ...nodes.map((n) => ({
      value: (n._id || n.id) as string,
      label: `[${typeLabels[n.type]}] ${n.message.slice(0, 50)}`,
    })),
  ];

  if (loading) {
    return (
      <div className="animate-fadein space-y-6">
        <PageHeader title="Chatbot Flow" description="Manage the chatbot conversation tree." />
        <div className="space-y-3">
          {[1,2,3,4].map((i) => <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadein space-y-6">
      <PageHeader title="Chatbot Flow" description="Manage predefined questions and answers for the site chatbot.">
        <Button onClick={openCreate}><Plus size={15} /> Add Node</Button>
      </PageHeader>

      {/* Flow tree */}
      <div className="space-y-3">
        {nodes.map((node) => {
          const id = node._id || node.id || "";
          return (
            <Card key={id} className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0f6b72]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <MessageSquare size={15} className="text-[#0f6b72]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge color={typeColors[node.type]}>{typeLabels[node.type]}</Badge>
                    {!node.is_active && <Badge color="gray">Hidden</Badge>}
                    <span className="text-[10px] text-[#62777d] font-bold">#{node.sort_order}</span>
                  </div>
                  <p className="text-sm font-bold text-[#062f36] leading-relaxed">{node.message}</p>
                  {node.options.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {node.options.map((opt, i) => (
                        <div key={i} className="flex items-center gap-1 px-2 py-1 bg-[#f5f8f8] border border-[#dbe7e9] rounded-lg text-xs font-bold text-[#062f36]">
                          <span>{opt.label}</span>
                          <ArrowRight size={10} className="text-[#0f6b72]" />
                          <span className="text-[#0f6b72] text-[10px] truncate max-w-[120px]">{nodeLabel(opt.next_id)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => openEdit(node)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#0f6b72] hover:bg-[#0f6b72]/10 transition-all">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setDeleteId(id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
        {nodes.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-[#62777d] font-bold">No chat nodes yet. Add one to get started.</p>
          </Card>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}
        title={editNode ? "Edit Chat Node" : "Add Chat Node"} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select label="Type" value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as ChatNode["type"] })}
              options={[
                { value: "start",    label: "Start — opening message" },
                { value: "question", label: "Question — show options" },
                { value: "answer",   label: "Answer — show text" },
                { value: "contact",  label: "Contact — show contact info" },
              ]} />
            <Input label="Sort Order" type="number" value={String(form.sort_order)}
              onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
          </div>

          <Textarea label="Bot Message" required rows={3} value={form.message}
            placeholder="What the bot says to the user..."
            onChange={(e) => setForm({ ...form, message: e.target.value })} />

          <div className="flex items-center gap-3">
            <Toggle checked={form.is_active} onChange={(v) => setForm({ ...form, is_active: v })} label="Active" />
          </div>

          {/* Options editor */}
          <div className="border border-[#dbe7e9] rounded-xl p-4 space-y-3">
            <p className="text-xs font-black text-[#062f36] uppercase tracking-wide">
              Options (buttons shown to user)
            </p>

            {form.options.length === 0 && (
              <p className="text-xs text-[#62777d]">No options — this is a leaf node (answer/contact).</p>
            )}

            {form.options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 bg-[#f5f8f8] rounded-lg border border-[#dbe7e9]">
                <span className="flex-1 text-sm font-bold text-[#062f36] truncate">{opt.label}</span>
                <ArrowRight size={12} className="text-[#0f6b72] shrink-0" />
                <span className="text-xs text-[#0f6b72] truncate max-w-[150px]">{nodeLabel(opt.next_id)}</span>
                <button onClick={() => removeOption(idx)}
                  className="w-6 h-6 flex items-center justify-center text-red-400 hover:bg-red-50 rounded transition-all shrink-0">
                  <X size={12} />
                </button>
              </div>
            ))}

            {/* Add new option */}
            <div className="pt-2 border-t border-[#dbe7e9] space-y-2">
              <p className="text-[10px] font-bold text-[#62777d] uppercase tracking-wide">Add option</p>
              <Input placeholder="Button label (e.g. Am I eligible?)" value={newOptionLabel}
                onChange={(e) => setNewOptionLabel(e.target.value)} />
              <Select label="Goes to node" value={newOptionNext}
                onChange={(e) => setNewOptionNext(e.target.value)}
                options={nodeOptions} />
              <Button variant="secondary" onClick={addOption}>
                <Plus size={13} /> Add Option
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-[#dbe7e9]">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}><Save size={14} /> {editNode ? "Update" : "Create"} Node</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={handleDelete} message="This will permanently delete this chat node." />
    </div>
  );
}
