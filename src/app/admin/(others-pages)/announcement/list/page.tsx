
"use client";

import { useState } from "react";
import { useDebounce } from "use-debounce";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/ui/card";
import { Button } from "@/components/ui/ui/button";
import { Input } from "@/components/ui/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/ui/dialog";
import { Plus, Upload, Download, RefreshCcw, Eye, Edit2, Trash2, X } from "lucide-react";
import { AnnouncementDialog } from "../add/page";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { useGetAnnouncements, useDeleteAnnouncement, useImportAnnouncements } from "@/hooks/useAnnouncements";
import { Announcement } from "@/types/announcement.typs";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Tooltip } from "@mui/material";

export function AnnouncementsPageContent() {
  const { data, isLoading, error, refetch, isFetching } = useGetAnnouncements();
  const deleteAnnouncement = useDeleteAnnouncement();
  const importAnnouncements = useImportAnnouncements();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 300);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  // ---------- EXPORT ----------
  const handleExport = () => {
    if (!data?.announcements || data.announcements.length === 0) {
      toast.error("No announcements to export");
      return;
    }
    const exportData = data.announcements.map((a) => ({
      Title: a.title,
      Description: a.description,
      Type: a.type,
      Status: a.status,
      Audience: a.targetAudience,
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Announcements");
    XLSX.writeFile(workbook, "announcements.xlsx");
  };

  // ---------- IMPORT ----------
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await importAnnouncements.mutateAsync(file);
    await refetch();
    e.currentTarget.value = "";
  };

  // ---------- DELETE ----------
  const handleDelete = async () => {
    if (!selectedAnnouncement?._id) return;
    await deleteAnnouncement.mutateAsync(selectedAnnouncement._id);
    setShowDeleteDialog(false);
    setSelectedAnnouncement(null);
    refetch();
  };

  // ---------- COLUMNS ----------
  const columns: GridColDef[] = [
    { field: "title", headerName: "Title", flex: 1, minWidth: 150 },
    { field: "type", headerName: "Type", flex: 1, minWidth: 120 },
    { field: "status", headerName: "Status", flex: 1, minWidth: 120 },
    { field: "targetAudience", headerName: "Audience", flex: 1, minWidth: 150 },
    {
      field: "actions",
      headerName: "",
      sortable: false,
      filterable: false,
      headerAlign: "right",
      align: "right",
      renderCell: (params) => {
        const a = params.row;
        return (
          <Box className="flex gap-2 justify-end w-full">
            <Tooltip title="View">
              <Button
                size="icon"
                variant="outline"
                className="bg-blue-500 hover:bg-blue-700 text-white"
                onClick={() => { setSelectedAnnouncement(a); setShowViewDialog(true); }}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </Tooltip>
            <Tooltip title="Edit">
              <Button
                size="icon"
                variant="outline"
                className="bg-green-500 hover:bg-green-700 text-white"
                onClick={() => { setSelectedAnnouncement(a); setShowEditDialog(true); }}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                size="icon"
                className="bg-red-500 hover:bg-red-700 text-white"
                onClick={() => { setSelectedAnnouncement(a); setShowDeleteDialog(true); }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </Tooltip>
          </Box>
        );
      },
      flex: 1.5,
      minWidth: 150,
    },
  ];

  // ---------- FILTER DATA ----------
  const rows = data?.announcements
    ?.filter((a) =>
      a.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      a.description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      a.type.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      a.status.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      a.targetAudience.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
    .map((a, idx) => ({ id: a._id, ...a, _rowIndex: idx })) || [];

  if (error) return <div className="p-6 text-destructive">⚠️ Error loading announcements</div>;

  return (
    <Card className="min-h-[calc(100vh-5rem)]">
      <CardHeader>
        <div className="flex flex-wrap justify-between gap-4 items-center">
          <div>
            <CardTitle className="text-2xl font-bold">Announcements</CardTitle>
            {!isLoading && <p className="text-muted-foreground text-sm">{rows.length} total announcements</p>}
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {/* SEARCH */}
            <div className="relative">
              <Input
                className="pl-8 max-w-[200px]"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-0 top-0 mt-1 mr-1"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* ICON BUTTONS */}
            <Tooltip title="Add Announcement">
              <Button onClick={() => setShowAddDialog(true)} className="h-9 bg-blue-600 text-white hover:bg-blue-700">
                <Plus className="h-4 w-4" />
              </Button>
            </Tooltip>

            <input id="import-file" type="file" hidden accept=".xlsx,.xls,.csv" onChange={handleImport} />
            <Tooltip title="Import">
              <Button asChild variant="outline">
                <label htmlFor="import-file" className="cursor-pointer flex items-center">
                  <Upload className="h-4 w-4 text-indigo-600" />
                </label>
              </Button>
            </Tooltip>

            <Tooltip title="Export">
              <Button variant="outline" className="h-9 text-gray-700 border-gray-300 hover:bg-gray-100" onClick={handleExport}>
                <Download className="h-4 w-4" />
              </Button>
            </Tooltip>

            <Tooltip title="Refresh">
              <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
                <RefreshCcw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              </Button>
            </Tooltip>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* MODERN DATA GRID */}
        <div style={{ width: "100%", overflowX: "auto" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            autoHeight
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 20, 50]}
            loading={isLoading}
            disableRowSelectionOnClick
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? "bg-gray-50" : "bg-white"
            }
            slotProps={{
              pagination: {
                sx: {
                  display: 'flex',
                  justifyContent: 'space-between',
                  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-select": {
                    order: -1,
                  },
                },
              },
            }}
            sx={{
              "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within": {
                outline: "none",
              },
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
            }}
          />
        </div>
      </CardContent>

      {/* DIALOGS */}
      <AnnouncementDialog
        open={showAddDialog || showEditDialog}
        onOpenChange={(open) => {
          setShowAddDialog(false);
          setShowEditDialog(false);
          if (!open) setSelectedAnnouncement(null);
        }}
        announcement={showEditDialog && selectedAnnouncement ? selectedAnnouncement : undefined}
      />

      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-[450px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle>Announcement Details</DialogTitle>
            <DialogDescription>Read-only information</DialogDescription>
          </DialogHeader>
          {selectedAnnouncement && (
            <div className="space-y-3 text-sm">
              <p><span className="text-muted-foreground">Title:</span> {selectedAnnouncement.title}</p>
              <p><span className="text-muted-foreground">Description:</span> {selectedAnnouncement.description}</p>
              <p><span className="text-muted-foreground">Type:</span> {selectedAnnouncement.type}</p>
              <p><span className="text-muted-foreground">Status:</span> {selectedAnnouncement.status}</p>
              <p><span className="text-muted-foreground">Audience:</span> {selectedAnnouncement.targetAudience}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[450px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle>Delete Announcement</DialogTitle>
            <DialogDescription>Are you sure you want to delete <strong>{selectedAnnouncement?.title}</strong>?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button className="bg-red-600 text-white hover:bg-red-700" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default function AnnouncementsPage() {
  return <AnnouncementsPageContent />;
}






