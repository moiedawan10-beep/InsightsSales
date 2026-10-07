import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {fetchBranchData, toRejectValue} from '../../api/client';
import {weeklySales} from '../../constants/endpoints';

export const WeeklySalesAction = createAsyncThunk(
  'WeeklySalesAction',
  async (area, {rejectWithValue}) => {
    try {
      return await fetchBranchData(weeklySales, area);
    } catch (error) {
      return rejectWithValue(toRejectValue(error));
    }
  },
);

export const WeeklySalesSlice = createSlice({
  name: 'WeeklySalesSlice',
  initialState: {
    loading: false,
    error: null,
    weeklySales: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(WeeklySalesAction.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(WeeklySalesAction.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.weeklySales = action.payload.Rows;
      })
      .addCase(WeeklySalesAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default WeeklySalesSlice.reducer;
