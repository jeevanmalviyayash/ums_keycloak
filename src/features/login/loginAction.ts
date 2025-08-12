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
  //async (_: undefined, { rejectWithValue }) => {
   async (userData: loginPayload, { rejectWithValue }) => {
    const formData = new URLSearchParams();
    formData.append("grant_type", "password");
    formData.append("client_id", "springboot-client");
    formData.append("username", userData.email);
    formData.append("password", userData.password);

    try {
      const response = await fetch("http://localhost:8180/realms/myrealm/protocol/openid-connect/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Login Failed");
      }

      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message || "Network Error");
    }
  }
);

// export const loginUser = createAsyncThunk(
//   "login/loginUser",
//   async (userData: loginPayload, { rejectWithValue }) => {
//     console.log(`${configApi.apiBaseUrl}`);
//     try {
//       const response = await fetch(`${configApi.apiBaseUrl}/auth/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(userData),
//       });

//       if (!response.ok) {
//         const errorData = await response?.json();

//         if (errorData && typeof errorData === "object") {
//           return rejectWithValue(errorData);
//         }

//         return rejectWithValue(errorData.message || "Registration Failed");
//       }
//       return await response.json();
//     } catch (error: any) {
//       const errorMessage = error.response?.json();

//       if (errorMessage && typeof errorMessage === "object") {
//         return rejectWithValue(errorMessage);
//       }

//       return rejectWithValue(error.message || "Newwork Error");
//     }
//   }
// );
