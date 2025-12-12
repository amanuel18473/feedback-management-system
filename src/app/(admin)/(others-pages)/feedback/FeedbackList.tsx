"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import FeedbackForm, { Feedback } from "./FeedbackForm";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";

interface FeedbackListProps {
  feedbacks: Feedback[];
}

export default function FeedbackList({ feedbacks }: FeedbackListProps) {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // SEARCH LOGIC
  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((f) =>
      [f.userName, f.email, f.subject, f.message]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, feedbacks]);

  const totalPages = Math.ceil(filteredFeedbacks.length / pageSize);
  const paginatedRows = filteredFeedbacks.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // EXPORT FUNCTION (CSV)
  const exportCSV = () => {
    if (feedbacks.length === 0) return;

    const header = Object.keys(feedbacks[0]).join(",");
    const rows = feedbacks
      .map((item) => Object.values(item).join(","))
      .join("\n");

    const blob = new Blob([header + "\n" + rows], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "feedbacks.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Feedback List
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track user feedbacks
          </p>
        </div>

        <div className="flex gap-2 mt-3 lg:mt-0">

          {/* Search */}
          <input
            type="text"
            placeholder="Search feedback..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm 
            dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />

          {/* Export */}
          <Button variant="outline" onClick={exportCSV}>
            Export
          </Button>

          {/* Add Feedback */}
          <Button onClick={() => setIsModalOpen(true)}>Add Feedback</Button>
        </div>
      </div>

      {/* TABLE */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>User Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Subject</TableCell>
            <TableCell>Message</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedRows.map((f) => (
            <TableRow key={f.feedbackId}>
              <TableCell>{f.userName}</TableCell>
              <TableCell>{f.email}</TableCell>
              <TableCell>{f.subject}</TableCell>
              <TableCell className="max-w-[300px] truncate">{f.message}</TableCell>
              <TableCell>{f.createdAt}</TableCell>
              <TableCell>
                <Button size="sm" variant="outline">
                  Reply
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
            onClick={() => setPage((p) => p - 1)}
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
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <FeedbackForm />
      </Modal>
    </div>
  );
}
