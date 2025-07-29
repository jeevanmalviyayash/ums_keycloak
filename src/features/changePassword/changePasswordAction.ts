import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import configApi from "../../configApi/configApi";

export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (
    {
      token,
      payload,
    }: {
      token: string;
      payload: {
        currentPassword: string;
        newPassword: string;
        confirmNewPassword: string;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${configApi.apiBaseUrl}/user/change-password`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return error.response.data;
    }
  }
);
