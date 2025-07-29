import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import configApi from "../../configApi/configApi";

interface GroupInput {
  id?: number;
  name: string;
  description: string;
}

export const fetchGroupById = createAsyncThunk<
  any,
  { token: string; id: any },
  { rejectValue: string }
>("", async ({ token, id }, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `${configApi.apiBaseUrl}/group/get/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Group: ", response.data);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch Group";

    return rejectWithValue(errorMessage || "Failed to fetch Group");
  }
});

export const fetchGroup = createAsyncThunk<
  any,
  String,
  { rejectValue: string }
>("", async (token, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${configApi.apiBaseUrl}/group/get`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Group : ", response.data);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch Group";

    return rejectWithValue(errorMessage || "Failed to fetch Group");
  }
});

export const updateGroupById = createAsyncThunk<
  any,
  { token: string; data: GroupInput },
  { rejectValue: string }
>("Groups/update", async ({ token, data }, { rejectWithValue }) => {
  try {
    const response = await axios.put(
      `${configApi.apiBaseUrl}/group/update/${data.id}`,
      {
        name: data.name,
        description: data.description,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Group updated:", response.data);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to update Group";
    return rejectWithValue(errorMessage);
  }
});

export const createGroup = createAsyncThunk<
  any,
  { token: string; data: GroupInput },
  { rejectValue: string }
>("Group/create", async ({ token, data }, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `${configApi.apiBaseUrl}/group/save`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Group created:", response.data);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to create Group";
    // return error.response?.data?.message || "Failed to create Group";
    return rejectWithValue(errorMessage);
  }
});

export const deleteGroupById = createAsyncThunk<
  number,
  { token: string; id: number },
  { rejectValue: string }
>("Group/delete", async ({ token, id }, { rejectWithValue }) => {
  try {
    await axios.delete(`${configApi.apiBaseUrl}/group/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return id;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to delete Group";
    return rejectWithValue(errorMessage);
  }
});
