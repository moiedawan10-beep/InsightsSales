import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {fetchBranchData, toRejectValue} from '../../api/client';
import {voidOrders} from '../../constants/endpoints';

export const VoidOrdersAction = createAsyncThunk(
  'VoidOrdersAction',
  async (area, {rejectWithValue}) => {
    try {
      return await fetchBranchData(voidOrders, area);
    } catch (error) {
      return rejectWithValue(toRejectValue(error));
    }
  },
);

export const VoidOrdersSlice = createSlice({
  name: 'VoidOrdersSlice',
  initialState: {
    loading: false,
    error: null,
    voidOrders: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(VoidOrdersAction.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(VoidOrdersAction.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.voidOrders = action.payload.Rows;
      })
      .addCase(VoidOrdersAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default VoidOrdersSlice.reducer;
