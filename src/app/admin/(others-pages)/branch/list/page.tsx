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
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Tooltip } from "@mui/material";

import { useGetBranches, useDeleteBranch, useImportBranches } from "@/hooks/useBranches";
import { Branch } from "@/types/branch.type";
import { BranchDialog } from "../add/page";

export function BranchesPageContent() {
  const { data, isLoading, error, refetch, isFetching } = useGetBranches();
  const deleteBranch = useDeleteBranch();
  const importBranches = useImportBranches();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 300);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  // ---------- EXPORT ----------
  const handleExport = () => {
    if (!data?.branches || data.branches.length === 0) {
      toast.error("No branches to export");
      return;
    }
    const exportData = data.branches.map((b) => ({
      Name: b.name,
      Region: b.region,
      District: b.district,
      City: b.city,
      Status: b.status || "",
      Telephone: `${b.telephone.countryCode} ${b.telephone.number}`,
      Address: b.address || "",
      Grade: b.grade || "",
      Description: b.description || "",
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Branches");
    XLSX.writeFile(workbook, "branches.xlsx");
  };

  // ---------- IMPORT ----------
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await importBranches.mutateAsync(file);
    await refetch();
    e.currentTarget.value = "";
  };

  // ---------- DELETE ----------
  const handleDelete = async () => {
    if (!selectedBranch?._id) return;
    await deleteBranch.mutateAsync(selectedBranch._id);
    setShowDeleteDialog(false);
    setSelectedBranch(null);
    refetch();
  };

  // ---------- COLUMNS ----------
  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
    { field: "region", headerName: "Region", flex: 1, minWidth: 120 },
    { field: "district", headerName: "District", flex: 1, minWidth: 120 },
    { field: "city", headerName: "City", flex: 1, minWidth: 120 },
    { field: "status", headerName: "Status", flex: 1, minWidth: 120 },
    {
      field: "actions",
      headerName: "",
      sortable: false,
      filterable: false,
      headerAlign: "right",
      align: "right",
      renderCell: (params) => {
        const b = params.row;
        return (
          <Box className="flex gap-2 justify-end w-full">
            <Tooltip title="View">
              <Button
                size="icon"
                variant="outline"
                className="bg-blue-500 hover:bg-blue-700 text-white"
                onClick={() => { setSelectedBranch(b); setShowViewDialog(true); }}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </Tooltip>
            <Tooltip title="Edit">
              <Button
                size="icon"
                variant="outline"
                className="bg-green-500 hover:bg-green-700 text-white"
                onClick={() => { setSelectedBranch(b); setShowEditDialog(true); }}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                size="icon"
                className="bg-red-500 hover:bg-red-700 text-white"
                onClick={() => { setSelectedBranch(b); setShowDeleteDialog(true); }}
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
  const rows = data?.branches
    ?.filter((b) =>
      b.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      b.region.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      b.district.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      b.city.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
    .map((b) => ({ id: b._id, ...b })) || [];

  if (error) return <div className="p-6 text-destructive">⚠️ Error loading branches</div>;

  return (
    <Card className="min-h-[calc(100vh-5rem)]">
      <CardHeader>
        <div className="flex flex-wrap justify-between gap-4 items-center">
          <div>
            <CardTitle className="text-2xl font-bold">Branches</CardTitle>
            {!isLoading && <p className="text-muted-foreground text-sm">{rows.length} total branches</p>}
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
            <Tooltip title="Add Branch">
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
        {/* DATA GRID */}
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
      <BranchDialog
        open={showAddDialog || showEditDialog}
        onOpenChange={(open) => {
          setShowAddDialog(false);
          setShowEditDialog(false);
          if (!open) setSelectedBranch(null);
        }}
        branch={showEditDialog && selectedBranch ? selectedBranch : undefined}
      />

      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-[800px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle>Branch Details</DialogTitle>
            <DialogDescription>Read-only information</DialogDescription>
          </DialogHeader>
          {selectedBranch && (
            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Name:</span> {selectedBranch.name}</p>
              <p><span className="text-muted-foreground">Region:</span> {selectedBranch.region}</p>
              <p><span className="text-muted-foreground">District:</span> {selectedBranch.district}</p>
              <p><span className="text-muted-foreground">City:</span> {selectedBranch.city}</p>
              <p><span className="text-muted-foreground">Status:</span> {selectedBranch.status}</p>
              <p><span className="text-muted-foreground">Telephone:</span> {selectedBranch.telephone.countryCode} {selectedBranch.telephone.number}</p>
              <p><span className="text-muted-foreground">Address:</span> {selectedBranch.address || "-"}</p>
              <p><span className="text-muted-foreground">Grade:</span> {selectedBranch.grade || "-"}</p>
              <p><span className="text-muted-foreground">Description:</span> {selectedBranch.description || "-"}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[700px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle>Delete Branch</DialogTitle>
            <DialogDescription>Are you sure you want to delete <strong>{selectedBranch?.name}</strong>?</DialogDescription>
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

export default function BranchesPage() {
  return <BranchesPageContent />;
}
