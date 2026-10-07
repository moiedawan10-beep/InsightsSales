import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {fetchBranchData, toRejectValue} from '../../api/client';
import {averageSales} from '../../constants/endpoints';

export const AverageSalesAction = createAsyncThunk(
  'AverageSalesAction',
  async (area, {rejectWithValue}) => {
    try {
      return await fetchBranchData(averageSales, area);
    } catch (error) {
      return rejectWithValue(toRejectValue(error));
    }
  },
);

export const AverageSalesSlice = createSlice({
  name: 'AverageSalesSlice',
  initialState: {
    loading: false,
    error: null,
    averageSale: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(AverageSalesAction.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(AverageSalesAction.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.averageSale = action.payload.Rows;
      })
      .addCase(AverageSalesAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default AverageSalesSlice.reducer;
