import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {fetchBranchData, toRejectValue} from '../../api/client';
import {hourlySales} from '../../constants/endpoints';

export const HourlySalesAction = createAsyncThunk(
  'HourlySalesAction',
  async (area, {rejectWithValue}) => {
    try {
      return await fetchBranchData(hourlySales, area);
    } catch (error) {
      return rejectWithValue(toRejectValue(error));
    }
  },
);

export const HourlySalesSlice = createSlice({
  name: 'HourlySalesSlice',
  initialState: {
    loading: false,
    error: null,
    hourlySales: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(HourlySalesAction.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(HourlySalesAction.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.hourlySales = action.payload.Rows;
      })
      .addCase(HourlySalesAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default HourlySalesSlice.reducer;
