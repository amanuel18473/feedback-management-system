import { createUser, deleteUser, getUserById, getUsers, updateUser, importUsers, exportUsers } from "@/services/user.service";
import { User } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// GET ALL USERS
export const useGetUsers = (params?: { page?: number; limit?: number; search?: string }) =>
  useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
    staleTime: 60_000,
  });

// CREATE USER
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully");
    },
    onError: (error: any) => {
      if (error.message === "EMAIL_EXISTS") {
        toast.error("Email already exists");
        return;
      }
      toast.error("Failed to create user");
      console.error(error);
    },
  });
};

// UPDATE USER
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) => updateUser(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", id] });
      toast.success("User updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update user");
      console.error(error);
    },
  });
};

// DELETE USER
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete user");
      console.error(error);
    },
  });
};

// IMPORT USERS
export const useImportUsers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => importUsers(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Users imported successfully");
    },
    onError: (error) => {
      toast.error("Failed to import users");
      console.error(error);
    },
  });
};

// EXPORT USERS
export const useExportUsers = () => {
  return useMutation({
    mutationFn: () => exportUsers(),
    onError: (error) => {
      toast.error("Failed to export users");
      console.error(error);
    },
  });
};
