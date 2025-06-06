import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ServerState {
  clients: ClientConfig[];
  activeTab: number;
}

const initialState: ServerState = {
  clients: [{ id: 1, name: "Client 1", server: { id: 1, name: "server" } }],
  activeTab: 1,
};

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    addClient(state, action: PayloadAction<ClientConfig>) {
      state.clients.push(action.payload);
      state.activeTab = action.payload.id; // Set the new server as active
    },
    setActiveTab(state, action: PayloadAction<number>) {
      state.activeTab = action.payload;
    },
    updateClient(state, action: PayloadAction<ClientConfig>) {
      const index = state.clients.findIndex(client => client.id === action.payload.id);
      if (index !== -1) {
        state.clients[index] = action.payload;
      }
    }
    // Add more reducers as needed (e.g., updateServer, removeServer)
  },
});

export const { addClient, setActiveTab, updateClient } = clientSlice.actions;
export default clientSlice.reducer;