import { createSlice } from "@reduxjs/toolkit";
import type { TClient } from "../../model/Types";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ServerState {
  clients: TClient[];
  activeTab: number;
}

const initialState: ServerState = {
  clients: [{ id: 1, name: "Client 1" }],
  activeTab: 1,
};

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    addClient(state, action: PayloadAction<TClient>) {
      state.clients.push(action.payload);
      state.activeTab = action.payload.id; // Set the new server as active
    },
    setActiveTab(state, action: PayloadAction<number>) {
      state.activeTab = action.payload;
    },
    // Add more reducers as needed (e.g., updateServer, removeServer)
  },
});

export const { addClient, setActiveTab } = clientSlice.actions;
export default clientSlice.reducer;