import { User } from "@/types/user";
import axios from "axios";

const BASE_URL = "/users";

export const getUsers = async (): Promise<User[]> => {
  const res = await axios.get(BASE_URL);
  return res.data;
};

export const createUser = async (user: Partial<User>): Promise<User> => {
  const res = await axios.post(BASE_URL, user);
  return res.data;
};

export const updateUser = async (id: string, user: Partial<User>): Promise<User> => {
  const res = await axios.put(`${BASE_URL}/${id}`, user);
  return res.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};
