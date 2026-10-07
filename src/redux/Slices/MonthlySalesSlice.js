import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {fetchBranchData, toRejectValue} from '../../api/client';
import {monthlySales} from '../../constants/endpoints';

export const MonthlySalesAction = createAsyncThunk(
  'MonthlySalesAction',
  async (area, {rejectWithValue}) => {
    try {
      return await fetchBranchData(monthlySales, area);
    } catch (error) {
      return rejectWithValue(toRejectValue(error));
    }
  },
);

export const MonthlySalesSlice = createSlice({
  name: 'MonthlySalesSlice',
  initialState: {
    monthlyloading: false,
    error: null,
    monthlySales: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(MonthlySalesAction.pending, state => {
        state.monthlyloading = true;
        state.error = null;
      })
      .addCase(MonthlySalesAction.fulfilled, (state, action) => {
        state.monthlyloading = false;
        state.error = null;
        state.monthlySales = action.payload.Rows;
      })
      .addCase(MonthlySalesAction.rejected, (state, action) => {
        state.monthlyloading = false;
        state.error = action.payload;
      });
  },
});

export default MonthlySalesSlice.reducer;
