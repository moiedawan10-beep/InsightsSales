import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {fetchBranchData, toRejectValue} from '../../api/client';
import {topSellingItems} from '../../constants/endpoints';

export const TopSellingItemsAction = createAsyncThunk(
  'TopSellingItemsAction',
  async (area, {rejectWithValue}) => {
    try {
      return await fetchBranchData(topSellingItems, area);
    } catch (error) {
      return rejectWithValue(toRejectValue(error));
    }
  },
);

export const TopSellingItemsSlice = createSlice({
  name: 'TopSellingItemsSlice',
  initialState: {
    loading: false,
    error: null,
    topItems: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(TopSellingItemsAction.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(TopSellingItemsAction.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.topItems = action.payload.Rows;
      })
      .addCase(TopSellingItemsAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default TopSellingItemsSlice.reducer;
