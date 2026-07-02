// "use client";
// import { useState, useEffect } from "react";
// import { Plus, Trash2, Save } from "lucide-react";
// import toast from "react-hot-toast";
// import { settingsService, type SiteSettings } from "@/app/services/contentServices";
// import PageHeader from "@/app/components/ui/PageHeader";
// import Card from "@/app/components/ui/Card";
// import Button from "@/app/components/ui/Button";

// export default function EligibilityPage() {
//   const [items, setItems] = useState<string[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [newItem, setNewItem] = useState("");
//   const [fullSettings, setFullSettings] = useState<SiteSettings | null>(null);

//   useEffect(() => {
//     const fetch = async () => {
//       try {
//         setLoading(true);
//         const data = await settingsService.get();
//         setFullSettings(data);
//         setItems(data?.eligibility_requirements || []);
//       } catch {
//         toast.error("Failed to load eligibility points");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetch();
//   }, []);

//   const handleSave = async () => {
//     if (!fullSettings) return;
//     setSaving(true);
//     try {
//       await settingsService.update({ ...fullSettings, eligibility_requirements: items });
//       toast.success("Eligibility points saved!");
//     } catch {
//       toast.error("Failed to save");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const add = () => {
//     const trimmed = newItem.trim();
//     if (!trimmed) return toast.error("Point cannot be empty.");
//     setItems((prev) => [...prev, trimmed]);
//     setNewItem("");
//   };

//   const update = (idx: number, val: string) => {
//     setItems((prev) => prev.map((item, i) => (i === idx ? val : item)));
//   };

//   const remove = (idx: number) => {
//     setItems((prev) => prev.filter((_, i) => i !== idx));
//   };

//   if (loading) {
//     return (
//       <div className="animate-fadein space-y-6 max-w-2xl">
//         <PageHeader title="Eligibility Points" description="Manage the eligibility requirements shown on the home page." />
//         <Card accent className="p-6 space-y-3">
//           {[1, 2, 3, 4].map((i) => (
//             <div key={i} className="h-10 bg-slate-100 rounded-xl animate-pulse" />
//           ))}
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="animate-fadein space-y-6 max-w-2xl">
//       <PageHeader
//         title="Eligibility Points"
//         description="These points appear on the home page eligibility section of the Spouse Visa site."
//       >
//         <Button onClick={handleSave} loading={saving}>
//           <Save size={15} /> Save Changes
//         </Button>
//       </PageHeader>

//       <Card accent className="p-6">
//         <div className="space-y-2.5 mb-5">
//           {items.length === 0 && (
//             <p className="text-sm text-[#62777d] text-center py-6">No eligibility points yet. Add one below.</p>
//           )}
//           {items.map((item, idx) => (
//             <div key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-[#dbe7e9] bg-white hover:border-[#0f6b72]/30 transition-all">
//               {/* Number badge */}
//               <span className="w-7 h-7 rounded-full bg-[#0f6b72]/10 text-[#0f6b72] text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
//                 {idx + 1}
//               </span>

//               {/* Editable textarea — full text visible, auto grows */}
//               <textarea
//                 value={item}
//                 onChange={(e) => update(idx, e.target.value)}
//                 rows={2}
//                 className="flex-1 px-3 py-2 rounded-lg border border-[#dbe7e9] bg-[#f5f8f8] text-sm text-[#062f36] font-medium focus:outline-none focus:border-[#0f6b72] focus:ring-2 focus:ring-[#0f6b72]/10 transition-all resize-none leading-relaxed"
//               />

//               {/* Always-visible action buttons */}
//               <div className="flex flex-col gap-1 shrink-0">
//                 <button
//                   title="Delete"
//                   onClick={() => remove(idx)}
//                   className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 border border-red-100 transition-all"
//                 >
//                   <Trash2 size={14} />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Add new point */}
//         <div className="flex gap-2 pt-4 border-t border-[#dbe7e9]">
//           <input
//             value={newItem}
//             onChange={(e) => setNewItem(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && add()}
//             placeholder="Type a new eligibility point and press Enter or Add..."
//             className="flex-1 h-10 px-4 rounded-xl border border-dashed border-[#0f6b72]/40 bg-[#0f6b72]/4 text-sm text-[#062f36] font-medium focus:outline-none focus:border-[#0f6b72] focus:ring-2 focus:ring-[#0f6b72]/10 transition-all"
//           />
//           <Button onClick={add} variant="secondary">
//             <Plus size={15} /> Add
//           </Button>
//         </div>
//       </Card>

//       <div className="flex justify-end">
//         <Button onClick={handleSave} loading={saving} size="lg">
//           <Save size={17} /> Save All Changes
//         </Button>
//       </div>
//     </div>
//   );
// }












"use client";
import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { settingsService, type SiteSettings } from "@/app/services/contentServices";
import PageHeader from "@/app/components/ui/PageHeader";
import DataTable from "@/app/components/ui/DataTable";
import Modal from "@/app/components/ui/Modal";
import ConfirmDialog from "@/app/components/ui/ConfirmDialog";
import Button from "@/app/components/ui/Button";
import Textarea from "@/app/components/ui/Textarea";

export default function EligibilityPage() {
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const [textInput, setTextInput] = useState("");
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [fullSettings, setFullSettings] = useState<SiteSettings | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await settingsService.get();
      setFullSettings(data);
      setItems(data?.eligibility_requirements || []);
    } catch {
      toast.error("Failed to load eligibility points");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    setTextInput("");
    setEditIdx(null);
    setModalOpen(true);
  };

  const openEdit = (text: string, idx: number) => {
    setTextInput(text);
    setEditIdx(idx);
    setModalOpen(true);
  };

  const handleSaveItem = async () => {
    const trimmed = textInput.trim();
    if (!trimmed) return toast.error("Eligibility requirement cannot be empty.");
    if (!fullSettings) return;

    let updatedItems = [...items];
    if (editIdx !== null) {
      // Edit mode
      updatedItems[editIdx] = trimmed;
    } else {
      // Add mode
      updatedItems.push(trimmed);
    }

    try {
      await settingsService.update({ ...fullSettings, eligibility_requirements: updatedItems });
      toast.success(editIdx !== null ? "Point updated!" : "Point added!");
      setModalOpen(false);
      fetchData();
    } catch {
      toast.error("Failed to save change");
    }
  };

  const handleDeleteItem = async () => {
    if (deleteIdx === null || !fullSettings) return;
    
    const updatedItems = items.filter((_, i) => i !== deleteIdx);

    try {
      await settingsService.update({ ...fullSettings, eligibility_requirements: updatedItems });
      toast.success("Eligibility point deleted.");
      setDeleteIdx(null);
      fetchData();
    } catch {
      toast.error("Failed to delete point");
    }
  };

  // DataTable ke liye array ko object format me map kiya taake easily render ho sake
  const tableData = items.map((text, index) => ({ text, index }));

  return (
    <div className="animate-fadein space-y-6">
      <PageHeader 
        title="Eligibility Points" 
        description="Manage the eligibility requirements shown on the home page."
      >
        <Button onClick={openCreate}>+ Add Eligibility Point</Button>
      </PageHeader>

      <DataTable
        data={tableData}
        searchKeys={["text"]}
        emptyMessage={loading ? "Loading requirements..." : "No eligibility points yet."}
        columns={[
          {
            key: "index",
            label: "#",
            width: "60px",
            render: (r) => (
              <span className="w-6 h-6 rounded-full bg-[#0f6b72]/10 text-[#0f6b72] text-xs font-bold flex items-center justify-center">
                {r.index + 1}
              </span>
            ),
          },
          {
            key: "text",
            label: "Requirement / Point",
            render: (r) => (
              <span className="font-bold text-[#062f36] max-w-2xl block truncate">
                {r.text}
              </span>
            ),
          },
        ]}
        actions={(r) => (
          <>
            <button
              onClick={() => openEdit(r.text, r.index)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#0f6b72] hover:bg-[#0f6b72]/10 transition-all"
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={() => setDeleteIdx(r.index)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 transition-all"
            >
              <Trash2 size={15} />
            </button>
          </>
        )}
      />

      <Modal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={editIdx !== null ? "Edit Eligibility Point" : "Add Eligibility Point"} 
        size="lg"
      >
        <div className="space-y-4">
          <Textarea
            label="Eligibility Requirement"
            required
            rows={4}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="e.g., Must have a minimum gross annual income of £29,000..."
          />
          <div className="flex justify-end gap-3 pt-2 border-t border-[#dbe7e9]">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveItem}>{editIdx !== null ? "Update" : "Add"} Point</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteIdx !== null}
        onClose={() => setDeleteIdx(null)}
        onConfirm={handleDeleteItem}
        message="This will permanently delete this eligibility point."
      />
    </div>
  );
}