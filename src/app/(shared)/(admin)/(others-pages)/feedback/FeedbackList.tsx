// "use client";

// import { useState } from "react";

// import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
// import { TableHead } from "@/components/ui/ui/table";
// import Button from "@/components/ui/button/Button";
// import { Feedback } from "@/types/feedback.type";
// import { useDeleteFeedback, useExportFeedbacks, useFilterFeedbacks, useGetAllFeedbacks, useSearchFeedbacks } from "@/hooks/useFeedback";
// import FeedbackFormDialog from "./FeedbackForm";

// export default function FeedbackList() {
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [openDialog, setOpenDialog] = useState(false);
//   const [editing, setEditing] = useState<Feedback | null>(null);

//   const { data, isLoading, refetch } = useGetAllFeedbacks({ page, limit });
//   const { mutate: deleteFeedback } = useDeleteFeedback();
//   const exportMutation = useExportFeedbacks();
//   const searchQuery = useSearchFeedbacks({ search: searchTerm });
//   const filterQuery = useFilterFeedbacks({ status: statusFilter });

//   const handleDelete = (id: string) => {
//     if (confirm("Are you sure to delete this feedback?")) {
//       deleteFeedback(id);
//     }
//   };

//   const handleExport = () => {
//     exportMutation.mutate();
//   };

//   let displayedFeedbacks = data?.feedbacks || [];
//   if (searchTerm && searchQuery.data) displayedFeedbacks = searchQuery.data;
//   if (statusFilter && filterQuery.data) displayedFeedbacks = filterQuery.data;

//   if (isLoading) return <p>Loading feedbacks...</p>;

//   return (
//     <div className="p-4 space-y-4">
//       <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
//         <div className="flex gap-2 flex-wrap">
//           <input
//             type="text"
//             placeholder="Search..."
//             className="border p-2 rounded"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <select
//             className="border p-2 rounded"
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//           >
//             <option value="">All Status</option>
//             <option value="Active">Active</option>
//             <option value="Resolved">Resolved</option>
//           </select>
//         </div>

//         <div className="flex gap-2 flex-wrap">
//           <Button onClick={() => setOpenDialog(true)}>Add Feedback</Button>
//           <Button variant="outline" onClick={handleExport}>Export CSV</Button>
//         </div>
//       </div>

//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Name</TableHead>
//             <TableHead>Email</TableHead>
//             <TableHead>Subject</TableHead>
//             <TableHead>Message</TableHead>
//             <TableHead>Date</TableHead>
//             <TableHead className="text-right">Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {displayedFeedbacks.map((fb) => (
//             <TableRow key={fb.feedbackId}>
//               <TableCell>{fb.userName}</TableCell>
//               <TableCell>{fb.email}</TableCell>
//               <TableCell>{fb.subject}</TableCell>
//               <TableCell>{fb.message}</TableCell>
//               <TableCell>{new Date(fb.createdAt).toLocaleString()}</TableCell>
//               <TableCell className="text-right space-x-2">
//                 <Button size="sm" onClick={() => { setEditing(fb); setOpenDialog(true); }}>Edit</Button>
//                 <Button size="sm" onClick={() => handleDelete(fb.feedbackId)}>Delete</Button>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>

//       {/* Pagination */}
//       <div className="flex justify-between items-center mt-4 flex-wrap gap-2">
//         <div>
//           <Button disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</Button>
//           <span className="mx-2">Page {page}</span>
//           <Button disabled={!data?.pagination.hasNextPage} onClick={() => setPage(page + 1)}>Next</Button>
//         </div>
//         <div>
//           <label>Items per page: </label>
//           <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="border p-1 rounded">
//             {[5, 10, 20, 50].map((n) => (
//               <option key={n} value={n}>{n}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <FeedbackFormDialog
//         open={openDialog}
//         feedback={editing}
//         onClose={() => { setOpenDialog(false); setEditing(null); refetch(); }}
//       />
//     </div>
//   );
// }
"use client";

import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";

import Button from "@/components/ui/button/Button";
import { Feedback } from "@/types/feedback.type";
import {
  useDeleteFeedback,
  useExportFeedbacks,
  useFilterFeedbacks,
  useGetAllFeedbacks,
  useSearchFeedbacks,
} from "@/hooks/useFeedback";
import FeedbackFormDialog from "./FeedbackForm";
import { DataTable } from "@/components/form/data-table";

export default function FeedbackList() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState<Feedback | null>(null);

  const { data, isLoading, refetch } = useGetAllFeedbacks({ page, limit });
  const { mutate: deleteFeedback } = useDeleteFeedback();
  const exportMutation = useExportFeedbacks();
  const searchQuery = useSearchFeedbacks({ search: searchTerm });
  const filterQuery = useFilterFeedbacks({ status: statusFilter });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure to delete this feedback?")) {
      deleteFeedback(id);
    }
  };

  const handleExport = () => {
    exportMutation.mutate();
  };

  /** -----------------------------
   * Data source resolution
   * ------------------------------*/
  let displayedFeedbacks: Feedback[] = data?.feedbacks || [];
  if (searchTerm && searchQuery.data) displayedFeedbacks = searchQuery.data;
  if (statusFilter && filterQuery.data) displayedFeedbacks = filterQuery.data;

  /** -----------------------------
   * DataGrid columns
   * ------------------------------*/
  const columns = useMemo<ColumnDef<Feedback>[]>(() => [
    {
      accessorKey: "userName",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "subject",
      header: "Subject",
    },
    {
      accessorKey: "message",
      header: "Message",
    },
    {
      header: "Date",
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleString(),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2 justify-end">
          <Button
            size="sm"
            onClick={() => {
              setEditing(row.original);
              setOpenDialog(true);
            }}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDelete(row.original.feedbackId)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ], []);

  if (isLoading) return <p>Loading feedbacks...</p>;

  return (
    <div className="p-4 space-y-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Search..."
            className="border p-2 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="border p-2 rounded"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button onClick={() => setOpenDialog(true)}>Add Feedback</Button>
          <Button variant="outline" onClick={handleExport}>
            Export CSV
          </Button>
        </div>
      </div>

      {/* Data Grid */}
      <DataTable columns={columns} data={displayedFeedbacks} />

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Button disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Prev
          </Button>
          <span>Page {page}</span>
          <Button
            disabled={!data?.pagination.hasNextPage}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>

        <div>
          <label className="mr-2">Items per page:</label>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="border p-1 rounded"
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <FeedbackFormDialog
        open={openDialog}
        feedback={editing}
        onClose={() => {
          setOpenDialog(false);
          setEditing(null);
          refetch();
        }}
      />
    </div>
  );
}
