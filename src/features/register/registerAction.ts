import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

import configApi from "../../configApi/configApi";

interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city: string;
  company: string;
  address: string;
  password: string;
  confirmPassword: string;
  role: string;
  roleId: number;
  loading: boolean;
  error: string | null;
  group: string;
  groupId: number;
}

export const registerUser = createAsyncThunk(
  "register/registerUser",
  async (userData: RegisterPayload, { rejectWithValue }) => {
    try {
      const response = await fetch(`  ${configApi.apiBaseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response?.json();

        if (errorData && typeof errorData === "object") {
          return rejectWithValue(errorData);
        }

        return rejectWithValue(errorData.message || "Registration Failed");
      }
      return await response.json();
    } catch (error: any) {
      const errorMessage = error.response?.json();

      if (errorMessage && typeof errorMessage === "object") {
        return rejectWithValue(errorMessage);
      }

      return rejectWithValue(error.message || "Newwork Error");
    }
  }
);

export const getFilterdUser = async (token, searchFilters: any) => {
  try{
     const allUser = await axios.post(
    `${configApi.apiBaseUrl}/user/get`,
    searchFilters,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log("User List: ", allUser.data);
  return allUser.data;
  }catch(error){
    return error.response?.data;
  }
};

export const fetchRole = createAsyncThunk<any, String, { rejectValue: string }>(
  "",
  async (token, { rejectWithValue }) => {
    try {
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

export const deleteUser = createAsyncThunk(
  "user/delete",
  async ({ token, id }: { token: string; id: any }, { rejectWithValue }) => {
    try {
      const result = await axios.delete(
        `${configApi.apiBaseUrl}/user/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return result.data;
    } catch (error: any) {
      const errorMessage = error.response?.data;

      if (errorMessage && typeof errorMessage === "object") {
        return rejectWithValue(errorMessage);
      }

      return rejectWithValue({ password: "Register Failed" });
    }
  }
);

export const addUser = createAsyncThunk(
  "user/register",
  async (
    { token, registerForm }: { token: string; registerForm: any },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${configApi.apiBaseUrl}/user/save`,
        registerForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data;

      if (errorMessage && typeof errorMessage === "object") {
        return rejectWithValue(errorMessage);
      }

      return rejectWithValue({ password: "Register Failed" });
    }
  }
);
