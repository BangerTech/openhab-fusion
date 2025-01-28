import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ConfigState {
  editingSidebar: boolean;
}

const initialState: ConfigState = {
  editingSidebar: false,
};

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setEditingSidebar: (state, action: PayloadAction<boolean>) => {
      state.editingSidebar = action.payload;
    },
  },
});

export const { setEditingSidebar } = configSlice.actions; 