 "use client";

import { useState, useMemo } from "react";
import { useDebounce } from "use-debounce";
import { Table, TableBody, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/ui/card";
import { Button } from "@/components/ui/ui/button";
import { Input } from "@/components/ui/ui/input";
import { Skeleton } from "@/components/ui/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/ui/dialog";
import { Download, Edit, Eye, Plus, RefreshCcw, Search, Upload, X } from "lucide-react";
import { useDeleteUser, useExportUsers, useGetUsers, useImportUsers, useUpdateUser } from "@/hooks/useUsers";
import { CreateUserDialog } from "../add/page";
import { TableHead } from "@/components/ui/ui/table";

interface UserData {
  _id: string;
  fullName: string;
  email: string;
  role: string;
}

export function UsersPageContent() {
  const { data, isLoading, error, refetch, isFetching } = useGetUsers();
  const deleteUser = useDeleteUser();
  const importUsers = useImportUsers();
  const exportUsers = useExportUsers();
  const updateUser = useUpdateUser();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 500);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({ fullName: "", email: "", role: "" });

  // ---------- FILTER ----------
  const filteredUsers = useMemo(() => {
    if (!data?.users) return [];
    const q = debouncedSearch.toLowerCase();
    return data.users.filter((user: UserData) => {
      if (!q) return true;
      return (
        user.fullName.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.role.toLowerCase().includes(q)
      );
    });
  }, [data, debouncedSearch]);

  // ---------- SELECT USER ----------
  const selectUser = (user: UserData) => {
    setSelectedUser(user);
    setFormData({ fullName: user.fullName, email: user.email, role: user.role });
  };

  // ---------- DELETE ----------
  const handleDelete = async () => {
    if (!selectedUser?._id) return;
    try {
      await deleteUser.mutateAsync(selectedUser._id);
      setShowDeleteDialog(false);
      setSelectedUser(null);
      await refetch();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // ---------- EDIT ----------
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser?._id) return;
    try {
      await updateUser.mutateAsync({ id: selectedUser._id, data: formData });
      setShowEditDialog(false);
      setSelectedUser(null);
      await refetch();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  // ---------- IMPORT ----------
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await importUsers.mutateAsync(file);
      await refetch();
      e.target.value = ""; // allow re-uploading the same file
    } catch (err) {
      console.error("Import failed:", err);
    }
  };

  // ---------- EXPORT ----------
  const handleExport = async () => {
    try {
      const blob = await exportUsers.mutateAsync();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "users.xlsx";
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-destructive">⚠️ Error loading users</div>
      </div>
    );
  }

  return (
    <Card className="min-h-[calc(100vh-5rem)]">
      <CardHeader>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold">Users</CardTitle>
            {!isLoading && <p className="text-muted-foreground text-sm">{filteredUsers.length} total users</p>}
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <Button onClick={() => setShowAddDialog(true)} className="h-9 bg-blue-600 text-white hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" /> Add User
            </Button>

            <label htmlFor="import-file">
              <Button variant="outline" className="h-9 text-gray-700 border-gray-300 hover:bg-gray-100 cursor-pointer">
                <Upload className="h-4 w-4 mr-2" /> Import
              </Button>
            </label>
            <input id="import-file" type="file" className="hidden" onChange={handleImport} />

            <Button variant="outline" className="h-9 text-gray-700 border-gray-300 hover:bg-gray-100" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" /> Export
            </Button>

            <Button variant="outline" onClick={() => refetch()} className="h-9" disabled={isFetching}>
              <RefreshCcw className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              {isFetching ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8" />
            </div>
            {searchQuery && <Button variant="outline" onClick={() => setSearchQuery("")} size="icon"><X className="h-4 w-4" /></Button>}
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <td><Skeleton className="h-4 w-[180px]" /></td>
                        <td><Skeleton className="h-4 w-[220px]" /></td>
                        <td><Skeleton className="h-4 w-[120px]" /></td>
                        <td><Skeleton className="h-4 w-[100px]" /></td>
                      </TableRow>
                    ))
                  : filteredUsers.length === 0
                  ? <TableRow><td colSpan={4} className="text-center py-8 text-muted-foreground">No users found</td></TableRow>
                  : filteredUsers.map((user: UserData) => (
                      <TableRow key={user._id}>
                        <td>{user.fullName}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td className="text-right flex gap-2 justify-end">
                          <Button variant="outline" size="sm" onClick={() => { selectUser(user); setShowViewDialog(true); }}>
                            <Eye className="h-4 w-4 mr-1" /> 
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            className="text-white bg-blue-600 hover:bg-blue-700 border-blue-600"
                            onClick={() => { selectUser(user); setShowEditDialog(true); }}
                            disabled={updateUser.isPending}
                          >
                            <Edit className="h-4 w-4 mr-1" /> {updateUser.isPending ? "Saving..." : ""}
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            className="text-white bg-red-600 hover:bg-red-700 border-red-600"
                            onClick={() => { selectUser(user); setShowDeleteDialog(true); }}
                            disabled={deleteUser.isPending}
                          >
                            {deleteUser.isPending ? "Deleting..." : ""}
                          </Button>
                        </td>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>

      {/* ADD USER */}
      <CreateUserDialog open={showAddDialog} onOpenChange={setShowAddDialog} />

      {/* EDIT USER */}
      <Dialog open={showEditDialog} onOpenChange={() => setShowEditDialog(false)}>
        <DialogContent className="sm:max-w-[1000px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
            <Input placeholder="Full Name" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required />
            <Input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            <Input placeholder="Role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required />
            <DialogFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
              <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700" disabled={updateUser.isPending}>
                {updateUser.isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* VIEW USER */}
      <Dialog open={showViewDialog} onOpenChange={() => setShowViewDialog(false)}>
        <DialogContent className="sm:max-w-[800px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle>View User</DialogTitle>
            <DialogDescription>User details</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <p><strong>Full Name:</strong> {formData.fullName}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Role:</strong> {formData.role}</p>
          </div>
          <DialogFooter className="flex justify-end">
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE USER */}
      <Dialog open={showDeleteDialog} onOpenChange={() => setShowDeleteDialog(false)}>
        <DialogContent className="sm:max-w-[700px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>This action cannot be undone. Are you sure you want to delete <strong>{formData.fullName}</strong>?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button className="bg-red-600 text-white hover:bg-red-700" onClick={handleDelete} disabled={deleteUser.isPending}>
              {deleteUser.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default function UsersPage() {
  return <UsersPageContent />;
}
