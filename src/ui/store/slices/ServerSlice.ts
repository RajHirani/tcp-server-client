import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ServerState {
  servers: CustomServer[];
  activeTab: number;
}

const initialState: ServerState = {
  servers: [{ id: 1, name: "Server 1", host: "0.0.0.0", status: false }],
  activeTab: 1,
};

const serverSlice = createSlice({
  name: "server",
  initialState,
  reducers: {
    addServer(state, action: PayloadAction<CustomServer>) {
      state.servers.push(action.payload);
      state.activeTab = action.payload.id; // Set the new server as active
    },
    setActiveTab(state, action: PayloadAction<number>) {
      state.activeTab = action.payload;
    },
    updateServer(state, action: PayloadAction<CustomServer>) {
      const index = state.servers.findIndex(server => server.id === action.payload.id);
      if (index !== -1) {
        state.servers[index] = action.payload;
      }
    }
    // Add more reducers as needed (e.g., updateServer, removeServer)
  },
});

export const { addServer, setActiveTab, updateServer } = serverSlice.actions;
export default serverSlice.reducer;