import { createAsyncThunk } from "@reduxjs/toolkit";
import configApi from "../../configApi/configApi";

interface loginPayload {
  email: string;
  password: string;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  shouldRedirect: boolean;
}

export const loginUser = createAsyncThunk(
  "login/loginUser",
  async (userData: loginPayload, { rejectWithValue }) => {
    console.log(`${configApi.apiBaseUrl}`);
    try {
      const response = await fetch(`${configApi.apiBaseUrl}/auth/login`, {
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
