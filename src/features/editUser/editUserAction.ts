import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import configApi from "../../configApi/configApi";

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (
    { token, id, payload }: { token: string; id: string; payload: any },
    { rejectWithValue }
  ) => {
    console.log("Token  Update", token);
    try {
      const response = await axios.put(
        `${configApi.apiBaseUrl}/user/update/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Unexpected error occurred." });
    }
  }
);

interface editPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city: string;
  company: string;
  address: string;
  role: string;
  roleId: number;
  loading: boolean;
  error: string | null;
}
