import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {fetchBranchData, toRejectValue} from '../../api/client';
import {categorySales} from '../../constants/endpoints';

export const SalesAnalysisCategoryPercantageAction = createAsyncThunk(
  'SalesAnalysisCategoryPercantageAction',
  async (area, {rejectWithValue}) => {
    try {
      return await fetchBranchData(categorySales, area);
    } catch (error) {
      return rejectWithValue(toRejectValue(error));
    }
  },
);

export const SalesAnalysisCategoryPercantageSlice = createSlice({
  name: 'SalesAnalysisCategoryPercantageSlice',
  initialState: {
    loading: false,
    error: null,
    data: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(SalesAnalysisCategoryPercantageAction.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        SalesAnalysisCategoryPercantageAction.fulfilled,
        (state, action) => {
          state.loading = false;
          state.error = null;
          state.data = action.payload.Rows;
        },
      )
      .addCase(
        SalesAnalysisCategoryPercantageAction.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        },
      );
  },
});

export default SalesAnalysisCategoryPercantageSlice.reducer;
