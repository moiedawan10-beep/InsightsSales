import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {fetchBranchData, toRejectValue} from '../../api/client';
import {yearlySales} from '../../constants/endpoints';

export const YearlySalesAction = createAsyncThunk(
  'YearlySalesAction',
  async (area, {rejectWithValue}) => {
    try {
      return await fetchBranchData(yearlySales, area);
    } catch (error) {
      return rejectWithValue(toRejectValue(error));
    }
  },
);

export const YearlySalesSlice = createSlice({
  name: 'YearlySalesSlice',
  initialState: {
    yearlyloading: false,
    error: null,
    yearlySales: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(YearlySalesAction.pending, state => {
        state.yearlyloading = true;
        state.error = null;
      })
      .addCase(YearlySalesAction.fulfilled, (state, action) => {
        state.yearlyloading = false;
        state.error = null;
        state.yearlySales = action.payload.Rows;
      })
      .addCase(YearlySalesAction.rejected, (state, action) => {
        state.yearlyloading = false;
        state.error = action.payload;
      });
  },
});

export default YearlySalesSlice.reducer;
