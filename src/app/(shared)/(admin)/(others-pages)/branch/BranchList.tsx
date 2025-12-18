// "use client";

// import { useState } from "react";
// import { useGetAllBranches, useDeleteBranch } from "@/hooks/useBranches";
// import Button from "@/components/ui/button/Button";
// import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
// import { TableHead } from "@/components/ui/ui/table";
// import BranchDialog from "./BranchForm";

// export default function BranchPage() {
//   const [page, setPage] = useState(1);
//   const limit = 10;

//   const { data, isLoading } = useGetAllBranches({
//     page,
//     limit,
//     status: "Active",
//   });

//   const { mutate: deleteBranch } = useDeleteBranch();
//   const [open, setOpen] = useState(false);
//   const [editing, setEditing] = useState<any>(null);

//   if (isLoading) return <p>Loading branches...</p>;

//   return (
//     <div className="p-6 space-y-4">
//       <Button onClick={() => setOpen(true)}>Add Branch</Button>

//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Name</TableHead>
//             <TableHead>City</TableHead>
//             <TableHead>Region</TableHead>
//             <TableHead className="text-right">Actions</TableHead>
//           </TableRow>
//         </TableHeader>

//         <TableBody>
//           {data?.branches.map((b) => (
//             <TableRow key={b._id}>
//               <TableCell>{b.name}</TableCell>
//               <TableCell>{b.city}</TableCell>
//               <TableCell>{b.region}</TableCell>
//               <TableCell className="text-right space-x-2">
//                 <Button size="sm" onClick={() => { setEditing(b); setOpen(true); }}>
//                   Edit
//                 </Button>
//                 <Button size="sm" onClick={() => deleteBranch(b._id)}>
//                   Delete
//                 </Button>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>

//       <BranchDialog
//         open={open}
//         branch={editing}
//         onClose={() => {
//           setOpen(false);
//           setEditing(null);
//         }}
//       />
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { useGetAllBranches, useDeleteBranch } from "@/hooks/useBranches";
import Button from "@/components/ui/button/Button";
import { Table, TableBody, TableCell, TableHeader, TableRow} from "@/components/ui/table";
import { TableHead } from "@/components/ui/ui/table";
import BranchDialog from "./BranchForm";

export default function BranchList() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useGetAllBranches({ page, limit, status: "Active" });
  const { mutate: deleteBranch } = useDeleteBranch();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  if (isLoading) return <p>Loading branches...</p>;

  return (
    <div className="p-6 space-y-4">
      <Button onClick={() => setOpen(true)}>Add Branch</Button>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Region</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.branches.map((b) => (
            <TableRow key={b._id}>
              <TableCell>{b.name}</TableCell>
              <TableCell>{b.city}</TableCell>
              <TableCell>{b.region}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button size="sm" onClick={() => { setEditing(b); setOpen(true); }}>Edit</Button>
                <Button size="sm" onClick={() => deleteBranch(b._id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <BranchDialog
        open={open}
        branch={editing}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
      />
    </div>
  );
}

