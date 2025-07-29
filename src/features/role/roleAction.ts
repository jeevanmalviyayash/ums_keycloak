import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import configApi from "../../configApi/configApi";

export const fetchRoleForRegisterPage = createAsyncThunk<
  any,
  { selectedGroup: number },
  { rejectValue: string }
>("group/fetch", async (selectedGroup, { rejectWithValue }) => {
  console.log("selectedGroup", selectedGroup);
  try {
    const response = await axios.get(
      `${configApi.apiBaseUrl}/auth/groups/${selectedGroup}/roles`
    );
    console.log("Role: ", response.data);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch Role";

    return rejectWithValue(errorMessage || "Failed to fetch Role");
  }
});

export const fetchRoleForUsingGroupIdForAddUser = createAsyncThunk<
  any,
  { token: string; id: number },
  { rejectValue: string }
>("group/fetch", async ({ token, id }, { rejectWithValue }) => {
  try {
    console.log("Token: ", token);
    const response = await axios.get(
      `${configApi.apiBaseUrl}/auth/groups/${id}/roles`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Role: ", response.data);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch Role";

    return rejectWithValue(errorMessage || "Failed to fetch Role");
  }
});

export const fetchGroupForRegisterPage = createAsyncThunk<
  any,
  void,
  { rejectValue: string }
>("", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${configApi.apiBaseUrl}/auth/getGroups`);
    console.log("Group Role: ", response.data);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch role";

    return rejectWithValue(errorMessage || "Failed to fetch role");
  }
});

export const fetchRole = createAsyncThunk<any, String, { rejectValue: string }>(
  "",
  async (token, { rejectWithValue }) => {
    try {
      console.log("Token: ", token);
      const response = await axios.get(
        `${configApi.apiBaseUrl}/auth/getRoles`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Role: ", response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch Role";

      return rejectWithValue(errorMessage || "Failed to fetch Role");
    }
  }
);

interface RoleInput {
  id?: number;
  name: string;
  description: string;
  groupId?: number;
}

export const updateRole = createAsyncThunk<
  any,
  { token: string; data: RoleInput },
  { rejectValue: string }
>("roles/update", async ({ token, data }, { rejectWithValue }) => {
  try {
    const response = await axios.put(
      `${configApi.apiBaseUrl}/role/update/${data.id}`,
      {
        name: data.name,
        description: data.description,
        groupId: data.groupId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Role updated:", response.data);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to update role";
    return rejectWithValue(errorMessage);
  }
});

export const createRole = createAsyncThunk<
  any,
  { token: string; data: RoleInput },
  { rejectValue: string }
>("roles/create", async ({ token, data }, { rejectWithValue }) => {
  try {
    // Or from cookies/auth state
    console.log("token: ", token);
    console.log("data: ", data);
    const response = await axios.post(
      `${configApi.apiBaseUrl}/role/save`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Role created:", response.data);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to create role";
    return rejectWithValue(errorMessage);
  }
});

export const deleteRole = createAsyncThunk<
  number,
  { token: string; id: number },
  { rejectValue: string }
>("roles/delete", async ({ token, id }, { rejectWithValue }) => {
  try {
    await axios.delete(`${configApi.apiBaseUrl}/role/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return id;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to delete role";
    return rejectWithValue(errorMessage);
  }
});
