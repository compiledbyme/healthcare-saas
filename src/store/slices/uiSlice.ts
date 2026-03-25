import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  viewMode: "grid" | "list";
  notification: {
    show: boolean;
    message: string;
    type: "success" | "error" | "info";
  } | null;
}

const initialState: UIState = {
  viewMode: "grid",
  notification: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setViewMode: (state, action: PayloadAction<"grid" | "list">) => {
      state.viewMode = action.payload;
    },
    showNotification: (
      state,
      action: PayloadAction<{
        message: string;
        type: "success" | "error" | "info";
      }>,
    ) => {
      state.notification = {
        show: true,
        ...action.payload,
      };
    },
    hideNotification: (state) => {
      state.notification = null;
    },
  },
});

export const { setViewMode, showNotification, hideNotification } =
  uiSlice.actions;
export default uiSlice.reducer;
