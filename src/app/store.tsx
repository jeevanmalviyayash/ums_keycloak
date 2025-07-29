import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";

import registerReducer from "../features/register/registerSlice";
import alertModal from "../features/modal/modalSlice";
import loginReducer from "../features/login/loginSlice";
import tokenReducer from "../features/token/tokenSlice";
import editUserReducer from "../features/editUser/editUser";
import roleReducer from "../features/role/roleSlice";
import profile from "../features/profile/profileSlice";
import groupReducer from "../features/group/groupSlice"

// Persist config for the token slice
const persistConfig = {
  key: "token",
  storage: storageSession,
};

const loginPersistConfig = {
  key: "login",
  storage: storageSession,
};

// Wrap only the token reducer with persistReducer
const persistedTokenReducer = persistReducer(persistConfig, tokenReducer);
const persistedLoginReducer = persistReducer(loginPersistConfig, loginReducer);

// Combine all reducers
const rootReducer = combineReducers({
  register: registerReducer,
  alertModal: alertModal,
  login: persistedLoginReducer,
  token: persistedTokenReducer, // use persisted reducer here
  editUser: editUserReducer,
  roleReducer: roleReducer,
  profile: profile,
  groupReducer: groupReducer,
});

// Create the store
// Configure store with middleware fix
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Persistor for PersistGate
export const persistor = persistStore(store);
