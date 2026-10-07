import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {fetchBranchData, toRejectValue} from '../../api/client';
import {serviceTypeSales} from '../../constants/endpoints';

export const SalesAnalysisServiceTypeSalesAction = createAsyncThunk(
  'SalesAnalysisServiceTypeSalesAction',
  async (area, {rejectWithValue}) => {
    try {
      return await fetchBranchData(serviceTypeSales, area);
    } catch (error) {
      return rejectWithValue(toRejectValue(error));
    }
  },
);

export const SalesAnalysisServiceTypeSalesSlice = createSlice({
  name: 'SalesAnalysisServiceTypeSalesSlice',
  initialState: {
    loading: false,
    error: null,
    data: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(SalesAnalysisServiceTypeSalesAction.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(SalesAnalysisServiceTypeSalesAction.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload.Rows;
      })
      .addCase(SalesAnalysisServiceTypeSalesAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default SalesAnalysisServiceTypeSalesSlice.reducer;
