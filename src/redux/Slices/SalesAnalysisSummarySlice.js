import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {fetchBranchData, toRejectValue} from '../../api/client';
import {salesSummary} from '../../constants/endpoints';

export const SalesAnalysisSummaryAction = createAsyncThunk(
  'SalesAnalysisSummaryAction',
  async (area, {rejectWithValue}) => {
    try {
      return await fetchBranchData(salesSummary, area);
    } catch (error) {
      return rejectWithValue(toRejectValue(error));
    }
  },
);

export const SalesAnalysisSummarySlice = createSlice({
  name: 'SalesAnalysisSummarySlice',
  initialState: {
    loading: false,
    error: null,
    summaryData: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(SalesAnalysisSummaryAction.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(SalesAnalysisSummaryAction.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.summaryData = action.payload.Rows;
      })
      .addCase(SalesAnalysisSummaryAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default SalesAnalysisSummarySlice.reducer;
