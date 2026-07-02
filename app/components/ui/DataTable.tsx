// "use client";
// import { Search, Plus } from "lucide-react";
// import React, { useState } from "react";
// import Button from "./Button";
// import Card from "./Card";

// interface Column<T> {
//   key: keyof T | string;
//   label: string;
//   render?: (row: T) => React.ReactNode;
//   width?: string;
// }

// interface DataTableProps<T extends { id: number }> {
//   columns: Column<T>[];
//   data: T[];
//   loading?: boolean;
//   onAdd?: () => void;
//   addLabel?: string;
//   searchKeys?: (keyof T)[];
//   emptyMessage?: string;
//   actions?: (row: T) => React.ReactNode;
// }

// export default function DataTable<T extends { id: number }>({
//   columns, data, loading, onAdd, addLabel = "Add New",
//   searchKeys = [], emptyMessage = "No records found.", actions,
// }: DataTableProps<T>) {
//   const [search, setSearch] = useState("");

//   const filtered = search
//     ? data.filter((row) =>
//         searchKeys.some((k) =>
//           String(row[k] ?? "").toLowerCase().includes(search.toLowerCase())
//         )
//       )
//     : data;

//   return (
//     <Card>
//       {/* Toolbar */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-[#dbe7e9]">
//         {searchKeys.length > 0 && (
//           <div className="relative w-full sm:max-w-xs">
//             <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
//             <input
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search..."
//               className="w-full h-9 pl-9 pr-4 rounded-xl border border-[#dbe7e9] bg-[#f5f8f8] text-sm font-medium text-[#062f36] placeholder-slate-400 outline-none focus:border-[#0f6b72] focus:ring-2 focus:ring-[#0f6b72]/15 focus:bg-white transition-all"
//             />
//           </div>
//         )}
//         {onAdd && (
//           <Button onClick={onAdd} size="sm" className="shrink-0 ml-auto">
//             <Plus size={15} /> {addLabel}
//           </Button>
//         )}
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full text-sm">
//           <thead>
//             <tr className="border-b border-[#dbe7e9] bg-[#f5f8f8]">
//               {columns.map((col) => (
//                 <th
//                   key={String(col.key)}
//                   className="px-4 py-3 text-left text-xs font-black text-[#62777d] uppercase tracking-wider whitespace-nowrap"
//                   style={{ width: col.width }}
//                 >
//                   {col.label}
//                 </th>
//               ))}
//               {actions && (
//                 <th className="px-4 py-3 text-right text-xs font-black text-[#62777d] uppercase tracking-wider w-24">
//                   Actions
//                 </th>
//               )}
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               [...Array(5)].map((_, i) => (
//                 <tr key={`loading-${i}`} className="border-b border-[#dbe7e9]/60">
//                   {columns.map((col) => (
//                     <td key={`loading-td-${String(col.key)}-${i}`} className="px-4 py-3">
//                       <div className="h-4 bg-slate-100 rounded-lg animate-pulse" />
//                     </td>
//                   ))}
//                   {actions && <td className="px-4 py-3" />}
//                 </tr>
//               ))
//             ) : filtered.length === 0 ? (
//               // FIX 1: Static conditional row par unique static key de di h
//               <tr key="empty-row">
//                 <td
//                   colSpan={columns.length + (actions ? 1 : 0)}
//                   className="px-4 py-16 text-center text-sm font-bold text-slate-400"
//                 >
//                   {emptyMessage}
//                 </td>
//               </tr>
//             ) : (
//               filtered.map((row) => (
//                 <tr
//                   key={row.id}
//                   className="border-b border-[#dbe7e9]/60 hover:bg-[#f5f8f8]/50 transition-colors"
//                 >
//                   {columns.map((col) => (
//                     <td key={`${row.id}-${String(col.key)}`} className="px-4 py-3 text-[#182d32] font-medium">
//                       {col.render
//                         ? col.render(row)
//                         : String((row as any)[col.key] ?? "—")}
//                     </td>
//                   ))}
//                   {actions && (
//                     <td className="px-4 py-3">
//                       <div className="flex items-center justify-end gap-1.5">
//                         {/* FIX 2: Actions children loop ko robust unique keys allocate karne ka safe built-in fallback */}
//                         {React.Children.map(actions(row), (child, index) => 
//                           React.isValidElement(child) 
//                             ? React.cloneElement(child, { key: child.key ?? `action-${row.id}-${index}` } as any)
//                             : child
//                         )}
//                       </div>
//                     </td>
//                   )}
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Footer */}
//       {filtered.length > 0 && (
//         <div className="px-4 py-3 border-t border-[#dbe7e9] bg-[#f5f8f8] rounded-b-2xl">
//           <p className="text-xs font-bold text-slate-400">
//             Showing {filtered.length} of {data.length} records
//           </p>
//         </div>
//       )}
//     </Card>
//   );
// }










"use client";
import { Search, Plus } from "lucide-react";
import React, { useState } from "react";
import Button from "./Button";
import Card from "./Card";

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
}

// FIX: Strict id restriction ko hata kar generic validation allow ki h (string | number ya MongoDB ki _id)
interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  onAdd?: () => void;
  addLabel?: string;
  searchKeys?: (keyof T)[];
  emptyMessage?: string;
  actions?: (row: T) => React.ReactNode;
}

export default function DataTable<T>({
  columns, data, loading, onAdd, addLabel = "Add New",
  searchKeys = [], emptyMessage = "No records found.", actions,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");

  const filtered = search
    ? data.filter((row) =>
        searchKeys.some((k) =>
          String(row[k] ?? "").toLowerCase().includes(search.toLowerCase())
        )
      )
    : data;

  return (
    <Card>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-[#dbe7e9]">
        {searchKeys.length > 0 && (
          <div className="relative w-full sm:max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full h-9 pl-9 pr-4 rounded-xl border border-[#dbe7e9] bg-[#f5f8f8] text-sm font-medium text-[#062f36] placeholder-slate-400 outline-none focus:border-[#0f6b72] focus:ring-2 focus:ring-[#0f6b72]/15 focus:bg-white transition-all"
            />
          </div>
        )}
        {onAdd && (
          <Button onClick={onAdd} size="sm" className="shrink-0 ml-auto">
            <Plus size={15} /> {addLabel}
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#dbe7e9] bg-[#f5f8f8]">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="px-4 py-3 text-left text-xs font-black text-[#62777d] uppercase tracking-wider whitespace-nowrap"
                  style={{ width: col.width }}
                >
                  {col.label}
                </th>
              ))}
              {actions && (
                <th className="px-4 py-3 text-right text-xs font-black text-[#62777d] uppercase tracking-wider w-24">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={`loading-${i}`} className="border-b border-[#dbe7e9]/60">
                  {columns.map((col) => (
                    <td key={`loading-td-${String(col.key)}-${i}`} className="px-4 py-3">
                      <div className="h-4 bg-slate-100 rounded-lg animate-pulse" />
                    </td>
                  ))}
                  {actions && <td className="px-4 py-3" />}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr key="empty-row">
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-4 py-16 text-center text-sm font-bold text-slate-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              filtered.map((row, index) => {
                // FIX: Runtime fallback lagaya h taaki agar id/ _id na bhi ho toh index backup key ban jaye
                const rowKey = (row as any).id || (row as any)._id || `row-${index}`;

                return (
                  <tr
                    key={rowKey}
                    className="border-b border-[#dbe7e9]/60 hover:bg-[#f5f8f8]/50 transition-colors"
                  >
                    {columns.map((col) => (
                      <td key={`${rowKey}-${String(col.key)}`} className="px-4 py-3 text-[#182d32] font-medium">
                        {col.render
                          ? col.render(row)
                          : String((row as any)[col.key] ?? "—")}
                      </td>
                    ))}
                    {actions && (
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          {React.Children.map(actions(row), (child, childIdx) => 
                            React.isValidElement(child) 
                              ? React.cloneElement(child, { key: child.key ?? `action-${rowKey}-${childIdx}` } as any)
                              : child
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {filtered.length > 0 && (
        <div className="px-4 py-3 border-t border-[#dbe7e9] bg-[#f5f8f8] rounded-b-2xl">
          <p className="text-xs font-bold text-slate-400">
            Showing {filtered.length} of {data.length} records
          </p>
        </div>
      )}
    </Card>
  );
}