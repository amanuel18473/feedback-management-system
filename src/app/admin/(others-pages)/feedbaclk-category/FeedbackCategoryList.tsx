"use client";

import { useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { TableHead } from "@/components/ui/ui/table";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/select/SelectField";
import Button from "@/components/ui/button/Button";
import FeedbackDialog from "./FeedbackDialog";
import { useGetFeedbacks, useDeleteFeedback } from "@/hooks/useFeedback";
import { Feedback } from "@/types/feedback.type";
import { exportToCSV } from "@/utils/exportCSV";

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

export default function FeedbackPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Feedback | null>(null);

  const { data = [], isLoading } = useGetFeedbacks();
  const { mutate: deleteFeedback } = useDeleteFeedback();

  /* 🔍 FILTERING */
  const filtered = useMemo(() => {
    return data.filter((f) => {
      const matchesSearch =
        `${f.message} ${f.tags.join(" ")} ${f.branch} ${f.region}`.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter ? f.category === categoryFilter : true;
      const matchesPriority = priorityFilter ? f.priority === priorityFilter : true;
      const matchesBranch = branchFilter ? f.branch === branchFilter : true;
      const matchesRegion = regionFilter ? f.region === regionFilter : true;
      return matchesSearch && matchesCategory && matchesPriority && matchesBranch && matchesRegion;
    });
  }, [data, search, categoryFilter, priorityFilter, branchFilter, regionFilter]);

  /* 📄 PAGINATION */
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-4">
      {/* ACTION BAR */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <Input
          placeholder="Search feedback..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />
        <Select
          placeholder="Category"
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
          options={["Complaints", "Suggestions", "Compliments", "Inquiries"]}
        />
        <Select
          placeholder="Priority"
          value={priorityFilter}
          onChange={(e) => {
            setPriorityFilter(e.target.value);
            setPage(1);
          }}
          options={["Low", "Medium", "High", "Urgent"]}
        />
        <Input
          placeholder="Branch"
          value={branchFilter}
          onChange={(e) => {
            setBranchFilter(e.target.value);
            setPage(1);
          }}
        />
        <Input
          placeholder="Region"
          value={regionFilter}
          onChange={(e) => {
            setRegionFilter(e.target.value);
            setPage(1);
          }}
        />
        <Button onClick={() => setOpen(true)}>Add Feedback</Button>
        <Button onClick={() => exportToCSV(filtered, "feedback.csv")}>Export CSV</Button>
      </div>

      {/* TABLE */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Message</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((f) => (
            <TableRow key={f.id}>
              <TableCell>{f.message}</TableCell>
              <TableCell>{f.category}</TableCell>
              <TableCell>{f.priority}</TableCell>
              <TableCell>{f.branch}</TableCell>
              <TableCell>{f.region}</TableCell>
              <TableCell>{f.tags.join(", ")}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditing(f);
                    setOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button size="sm" onClick={() => deleteFeedback(f.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-2 items-center">
          <Button
            size="sm"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </Button>
          <span>
            {page} / {totalPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
        <div>
          Items per page:{" "}
          <select
            className="border rounded p-1"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setPage(1);
            }}
          >
            {ITEMS_PER_PAGE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* DIALOG */}
      <FeedbackDialog
        open={open}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        feedback={editing}
      />
    </div>
  );
}
