"use client";

import { useState } from "react";
import { useGetAllAnnouncements, useDeleteAnnouncement } from "@/hooks/useAnnouncements";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Button from "@/components/ui/button/Button";
import AnnouncementDialog from "./AnnouncementForm";

export default function AnnouncementList() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useGetAllAnnouncements({ page, limit, status: "Published" });
  const { mutate: deleteAnnouncement } = useDeleteAnnouncement();

  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  if (isLoading) return <p>Loading announcements...</p>;

  // Access announcements via data.data.announcements
  const announcements = data?.data.announcements || [];

  return (
    <div className="p-6 space-y-4">
      <Button onClick={() => setOpenDialog(true)}>Add Announcement</Button>

      <Table>
        <TableHeader>
          <TableRow>
            <th>Title</th>
            <th>Type</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </TableRow>
        </TableHeader>

        <TableBody>
          {announcements.map((announcement) => (
            <TableRow key={announcement._id}>
              <TableCell>{announcement.title}</TableCell>
              <TableCell>{announcement.type}</TableCell>
              <TableCell>{announcement.status}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  size="sm"
                  onClick={() => {
                    setEditing(announcement);
                    setOpenDialog(true);
                  }}
                >
                  Edit
                </Button>
                <Button size="sm" onClick={() => deleteAnnouncement(announcement._id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AnnouncementDialog
        open={openDialog}
        initialData={editing}
        onClose={() => {
          setOpenDialog(false);
          setEditing(null);
        }}
      />
    </div>
  );
}
