"use client";

import { useState } from "react";
import { useDebounce } from "use-debounce";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/ui/card";
import { Button } from "@/components/ui/ui/button";
import { Input } from "@/components/ui/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/ui/dialog";
import { Plus, RefreshCcw, Eye, Edit2, Trash2, X, Search } from "lucide-react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Tooltip } from "@mui/material";
import { useGetFeedbacks, useDeleteFeedback } from "@/hooks/useFeedback";
import { FeedbackDialog } from "../add/pag";

export interface FeedbackData {
  _id: string;
  customer: string;
  comment: string;
  rating: number;
  type: string;
  status: string;
  department: string;
  branchId: string;
  attachments?: any;
}

export function FeedbackPageContent() {
  const { data, isLoading, error, refetch, isFetching } = useGetFeedbacks();
  const deleteFeedback = useDeleteFeedback();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 300);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackData | null>(null);

  // ---------- CAST API DATA TO FeedbackData ----------
  const feedbacks: FeedbackData[] = (data?.feedbacks || []) as unknown as FeedbackData[];

  // ---------- FILTER DATA ----------
  const rows = feedbacks
    .filter(f =>
      f.customer.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      f.comment.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      f.type.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      f.status.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
    .map(f => ({ id: f._id, ...f }));

  // ---------- COLUMNS ----------
  const columns: GridColDef[] = [
    { field: "customer", headerName: "Customer", flex: 1, minWidth: 150 },
    { field: "comment", headerName: "Comment", flex: 2, minWidth: 200 },
    { field: "rating", headerName: "Rating", flex: 0.5, minWidth: 80 },
    { field: "type", headerName: "Type", flex: 1, minWidth: 120 },
    { field: "status", headerName: "Status", flex: 1, minWidth: 120 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      headerAlign: "right",
      align: "right",
      renderCell: (params) => {
        const f = params.row as FeedbackData;
        return (
          <Box className="flex gap-2 justify-end w-full">
            <Tooltip title="View">
              <Button
                size="icon"
                variant="outline"
                className="bg-blue-500 hover:bg-blue-700 text-white"
                onClick={() => { setSelectedFeedback(f); setShowViewDialog(true); }}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </Tooltip>

            <Tooltip title="Edit">
              <Button
                size="icon"
                variant="outline"
                className="bg-green-500 hover:bg-green-700 text-white"
                onClick={() => { setSelectedFeedback(f); setShowEditDialog(true); }}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </Tooltip>

            <Tooltip title="Delete">
              <Button
                size="icon"
                className="bg-red-500 hover:bg-red-700 text-white"
                onClick={() => { setSelectedFeedback(f); setShowDeleteDialog(true); }}
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

  // ---------- DELETE ----------
  const handleDelete = async () => {
    if (!selectedFeedback?._id) return;
    await deleteFeedback.mutateAsync(selectedFeedback._id);
    setShowDeleteDialog(false);
    setSelectedFeedback(null);
    await refetch();
  };

  if (error) return <div className="p-6 text-destructive">⚠️ Error loading feedbacks</div>;

  return (
    <Card className="min-h-[calc(100vh-5rem)]">
      <CardHeader>
        <div className="flex flex-wrap justify-between gap-4 items-center">
          <div>
            <CardTitle className="text-2xl font-bold">Feedbacks</CardTitle>
            {!isLoading && <p className="text-muted-foreground text-sm">{rows.length} total feedbacks</p>}
          </div>

          <div className="flex flex-wrap gap-2 items-center">

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


            <Button onClick={() => setShowAddDialog(true)} className="h-9 bg-blue-600 text-white hover:bg-blue-700">
              <Plus className="h-4 w-4" />
            </Button>

            <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCcw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div style={{ width: "100%", overflowX: "auto" }}>
          <div className="min-w-[900px]">
            <DataGrid
              rows={rows}
              columns={columns}
              autoHeight
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[5, 10, 20, 50]}
              loading={isLoading}
              disableRowSelectionOnClick
            />
          </div>
        </div>
      </CardContent>

      {/* ADD / EDIT */}
      <FeedbackDialog
        open={showAddDialog || showEditDialog}
        onOpenChange={(open) => {
          setShowAddDialog(false);
          setShowEditDialog(false);
          if (!open) setSelectedFeedback(null);
        }}
        feedback={showEditDialog && selectedFeedback ? selectedFeedback : undefined}
      />

      {/* VIEW */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-[450px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle>View Feedback</DialogTitle>
            <DialogDescription>Feedback details</DialogDescription>
          </DialogHeader>
          {selectedFeedback && (
            <div className="space-y-2 py-4 text-sm">
              <p><strong>Customer:</strong> {selectedFeedback.customer}</p>
              <p><strong>Comment:</strong> {selectedFeedback.comment}</p>
              <p><strong>Rating:</strong> {selectedFeedback.rating}</p>
              <p><strong>Type:</strong> {selectedFeedback.type}</p>
              <p><strong>Status:</strong> {selectedFeedback.status}</p>
              <p><strong>Department:</strong> {selectedFeedback.department}</p>
              <p><strong>Branch ID:</strong> {selectedFeedback.branchId}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[450px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle>Delete Feedback</DialogTitle>
            <DialogDescription>Are you sure you want to delete <strong>{selectedFeedback?.customer}</strong>?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button className="bg-red-600 text-white hover:bg-red-700" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default function FeedbackPage() {
  return <FeedbackPageContent />;
}
