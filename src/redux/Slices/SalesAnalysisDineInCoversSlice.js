import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {fetchBranchData, toRejectValue} from '../../api/client';
import {dineInCovers} from '../../constants/endpoints';

export const SalesAnalysisDineInCoversAction = createAsyncThunk(
  'SalesAnalysisDineInCoversAction',
  async (area, {rejectWithValue}) => {
    try {
      return await fetchBranchData(dineInCovers, area);
    } catch (error) {
      return rejectWithValue(toRejectValue(error));
    }
  },
);

export const SalesAnalysisDineInCoversSlice = createSlice({
  name: 'SalesAnalysisDineInCoversSlice',
  initialState: {
    loading: false,
    error: null,
    data: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(SalesAnalysisDineInCoversAction.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(SalesAnalysisDineInCoversAction.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload.Rows;
      })
      .addCase(SalesAnalysisDineInCoversAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default SalesAnalysisDineInCoversSlice.reducer;
