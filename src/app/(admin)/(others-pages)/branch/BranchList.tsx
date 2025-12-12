"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import Button from "@/components/ui/button/Button";
import BranchForm, { Branch } from "./BranchForm";
import { Modal } from "@/components/ui/modal";

interface BranchListProps {
  branches: Branch[];
}

export default function BranchList({ branches }: BranchListProps) {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // PAGINATION
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // SEARCH
  const filteredBranches = useMemo(() => {
    return branches.filter((b) =>
      [b.branchName, b.region, b.district, b.city]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, branches]);

  const totalPages = Math.ceil(filteredBranches.length / pageSize);
  const paginatedBranches = filteredBranches.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // EXPORT FUNCTIONS
  const exportCSV = () => {
    const header = Object.keys(branches[0]).join(",");
    const rows = branches
      .map((branch) => Object.values(branch).join(","))
      .join("\n");

    const blob = new Blob([header + "\n" + rows], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "branches.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Branch List
          </h3>
          <p className="text-sm text-gray-500">Manage all branches</p>
        </div>

        <div className="flex gap-2 mt-3 lg:mt-0">

          {/* Search */}
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm 
            dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />

          {/* Export */}
          <Button variant="outline" onClick={exportCSV}>
            Export
          </Button>

          {/* Add */}
          <Button onClick={() => setIsModalOpen(true)}>Add Branch</Button>
        </div>
      </div>

      {/* TABLE */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Branch ID</TableCell>
            <TableCell>Branch Name</TableCell>
            <TableCell>Region</TableCell>
            <TableCell>District</TableCell>
            <TableCell>City</TableCell>
            <TableCell>Grade</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedBranches.map((branch) => (
            <TableRow key={branch.branchId}>
              <TableCell>{branch.branchId}</TableCell>
              <TableCell>{branch.branchName}</TableCell>
              <TableCell>{branch.region}</TableCell>
              <TableCell>{branch.district}</TableCell>
              <TableCell>{branch.city}</TableCell>
              <TableCell>{branch.grade}</TableCell>
              <TableCell>{branch.phone}</TableCell>
              <TableCell>{branch.createdAt}</TableCell>
              <TableCell>
                <Button size="sm" variant="outline">
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* PAGINATION */}
      <div className="flex items-center justify-between mt-4">

        {/* Items Per Page */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page:</span>
          <select
            className="border rounded px-2 py-1"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>

        {/* Page Controls */}
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Prev
          </Button>

          <span className="text-sm">
            Page {page} of {totalPages}
          </span>

          <Button
            size="sm"
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <BranchForm />
      </Modal>
    </div>
  );
}
