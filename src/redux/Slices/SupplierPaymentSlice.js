import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {fetchBranchData, toRejectValue} from '../../api/client';
import {supplierPayments} from '../../constants/endpoints';

export const SupplierPaymentAction = createAsyncThunk(
  'SupplierPaymentAction',
  async (area, {rejectWithValue}) => {
    try {
      return await fetchBranchData(supplierPayments, area);
    } catch (error) {
      return rejectWithValue(toRejectValue(error));
    }
  },
);

export const SupplierPaymentSlice = createSlice({
  name: 'SupplierPaymentSlice',
  initialState: {
    loading: false,
    error: null,
    supplierPayment: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(SupplierPaymentAction.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(SupplierPaymentAction.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.supplierPayment = action.payload.Rows;
      })
      .addCase(SupplierPaymentAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default SupplierPaymentSlice.reducer;
