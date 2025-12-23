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
import { Plus, Upload, Download, RefreshCcw, Eye, Edit2, Trash2, X, Search } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Tooltip } from "@mui/material";

import {
  useGetQrCodes,
  useDeleteQrCode,
  useImportQrCodes,
} from "@/hooks/useQrCodes";
import { QrCode } from "@/types/qrcode.type";
import { QrCodeDialog } from "../add/page";

/* ======================
   PAGE
====================== */
export function QrcodesPageContent() {
  const { data, isLoading, error, refetch, isFetching } = useGetQrCodes();
  const deleteQrCode = useDeleteQrCode();
  const importQrCodes = useImportQrCodes();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 300);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [selectedQrCode, setSelectedQrCode] = useState<QrCode | null>(null);

  /* ======================
     EXPORT
  ====================== */
  const handleExport = () => {
    if (!data?.qrCodes || data.qrCodes.length === 0) {
      toast.error("No QR Codes to export");
      return;
    }

    const exportData = data.qrCodes.map((q) => ({
      Name: q.name,
      Description: q.description,
      Type: q.type,
      Branch: q.branch,
      Department: q.department,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "QR Codes");
    XLSX.writeFile(workbook, "qr-codes.xlsx");
  };

  /* ======================
     IMPORT
  ====================== */
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await importQrCodes.mutateAsync(file);
    await refetch();
    e.currentTarget.value = "";
  };

  /* ======================
     DELETE
  ====================== */
  const handleDelete = async () => {
    if (!selectedQrCode?._id) return;

    await deleteQrCode.mutateAsync(selectedQrCode._id);
    setShowDeleteDialog(false);
    setSelectedQrCode(null);
    refetch();
  };

  /* ======================
     COLUMNS
  ====================== */
  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
    { field: "type", headerName: "Type", flex: 1, minWidth: 120 },
    { field: "branch", headerName: "Branch", flex: 1, minWidth: 120 },
    { field: "department", headerName: "Department", flex: 1, minWidth: 150 },
    {
      field: "actions",
      headerName: "",
      sortable: false,
      filterable: false,
      headerAlign: "right",
      align: "right",
      renderCell: (params) => {
        const qr = params.row;
        return (
          <Box className="flex gap-2 justify-end w-full">
            <Tooltip title="View">
              <Button
                size="icon"
                className="bg-blue-500 hover:bg-blue-700 text-white"
                onClick={() => {
                  setSelectedQrCode(qr);
                  setShowViewDialog(true);
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </Tooltip>

            <Tooltip title="Edit">
              <Button
                size="icon"
                className="bg-green-500 hover:bg-green-700 text-white"
                onClick={() => {
                  setSelectedQrCode(qr);
                  setShowEditDialog(true);
                }}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </Tooltip>

            <Tooltip title="Delete">
              <Button
                size="icon"
                className="bg-red-500 hover:bg-red-700 text-white"
                onClick={() => {
                  setSelectedQrCode(qr);
                  setShowDeleteDialog(true);
                }}
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

  /* ======================
     FILTER ROWS
  ====================== */
  const rows =
    data?.qrCodes
      ?.filter((q) =>
        q.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        q.description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        q.type.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        q.branch.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        q.department.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
      .map((q, idx) => ({ id: q._id, ...q, _rowIndex: idx })) || [];

  if (error) {
    return <div className="p-6 text-destructive">⚠️ Error loading QR Codes</div>;
  }

  return (
    <Card className="min-h-[calc(100vh-5rem)]">
      <CardHeader>
        <div className="flex flex-wrap justify-between gap-4 items-center">
          <div>
            <CardTitle className="text-2xl font-bold">QR Codes</CardTitle>
            {!isLoading && (
              <p className="text-muted-foreground text-sm">
                {rows.length} total QR Codes
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {/* SEARCH */}

<div className="relative">
  {/* Search icon */}
  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

  <Input
    className="pl-8 max-w-[200px]" // add left padding for icon
    placeholder="Search..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />

  {/* Clear button */}
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


            {/* ACTION BUTTONS */}
            <Tooltip title="Add QR Code">
              <Button
                onClick={() => setShowAddDialog(true)}
                className="h-9 bg-blue-600 text-white hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </Tooltip>

            <input
              id="import-file"
              type="file"
              hidden
              accept=".xlsx,.xls,.csv"
              onChange={handleImport}
            />

            <Tooltip title="Import">
              <Button asChild variant="outline">
                <label htmlFor="import-file" className="cursor-pointer">
                  <Upload className="h-4 w-4 text-indigo-600" />
                </label>
              </Button>
            </Tooltip>

            <Tooltip title="Export">
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4" />
              </Button>
            </Tooltip>

            <Tooltip title="Refresh">
              <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
                <RefreshCcw
                  className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
                />
              </Button>
            </Tooltip>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <DataGrid
          rows={rows}
          columns={columns}
          autoHeight
          loading={isLoading}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20, 50]}
          disableRowSelectionOnClick
        />
      </CardContent>

      {/* ADD / EDIT */}
      <QrCodeDialog
        open={showAddDialog || showEditDialog}
        onOpenChange={() => {
          setShowAddDialog(false);
          setShowEditDialog(false);
          setSelectedQrCode(null);
        }}
        qrCode={showEditDialog ? selectedQrCode ?? undefined : undefined}
      />

      {/* VIEW */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR Code Details</DialogTitle>
            <DialogDescription>Read-only information</DialogDescription>
          </DialogHeader>

          {selectedQrCode && (
            <div className="space-y-2 text-sm">
              <p><b>Name:</b> {selectedQrCode.name}</p>
              <p><b>Description:</b> {selectedQrCode.description}</p>
              <p><b>Type:</b> {selectedQrCode.type}</p>
              <p><b>Branch:</b> {selectedQrCode.branch}</p>
              <p><b>Department:</b> {selectedQrCode.department}</p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete QR Code</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{selectedQrCode?.name}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-red-600 text-white" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default function QrcodesPage() {
  return <QrcodesPageContent />;
}
