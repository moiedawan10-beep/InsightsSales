import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {fetchBranchData, toRejectValue} from '../../api/client';
import {runningOrders} from '../../constants/endpoints';

export const RunningOrdersAction = createAsyncThunk(
  'RunningOrdersAction',
  async (area, {rejectWithValue}) => {
    try {
      return await fetchBranchData(runningOrders, area);
    } catch (error) {
      return rejectWithValue(toRejectValue(error));
    }
  },
);

export const RunningOrdersSlice = createSlice({
  name: 'RunningOrdersSlice',
  initialState: {
    loading: false,
    error: null,
    data: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(RunningOrdersAction.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(RunningOrdersAction.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload.Rows;
      })
      .addCase(RunningOrdersAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default RunningOrdersSlice.reducer;
