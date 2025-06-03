import { createSlice } from "@reduxjs/toolkit";
import type { TServer } from "../../model/Types";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ServerState {
  servers: TServer[];
  activeTab: number;
}

const initialState: ServerState = {
  servers: [{ id: 1, name: "Server 1", status: true }],
  activeTab: 1,
};

const serverSlice = createSlice({
  name: "server",
  initialState,
  reducers: {
    addServer(state, action: PayloadAction<TServer>) {
      state.servers.push(action.payload);
      state.activeTab = action.payload.id; // Set the new server as active
    },
    setActiveTab(state, action: PayloadAction<number>) {
      state.activeTab = action.payload;
    },
    // Add more reducers as needed (e.g., updateServer, removeServer)
  },
});

export const { addServer, setActiveTab } = serverSlice.actions;
export default serverSlice.reducer;