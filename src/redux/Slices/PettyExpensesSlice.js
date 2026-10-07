import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {fetchBranchData, toRejectValue} from '../../api/client';
import {pettyExpenses} from '../../constants/endpoints';

export const PettyExpensesAction = createAsyncThunk(
  'PettyExpensesAction',
  async (area, {rejectWithValue}) => {
    try {
      return await fetchBranchData(pettyExpenses, area);
    } catch (error) {
      return rejectWithValue(toRejectValue(error));
    }
  },
);

export const PettyExpensesSlice = createSlice({
  name: 'PettyExpensesSlice',
  initialState: {
    loading: false,
    error: null,
    pettyExpense: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(PettyExpensesAction.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(PettyExpensesAction.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.pettyExpense = action.payload.Rows;
      })
      .addCase(PettyExpensesAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default PettyExpensesSlice.reducer;
