import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import api, {toRejectValue} from '../../api/client';
import {clients} from '../../constants/endpoints';

export const verifyPinAction = createAsyncThunk(
  'verifyPinAction',
  async (pin, thunkAPI) => {
    const {rejectWithValue} = thunkAPI;
    try {
      const response = await api.get(clients);
      const client = response.data?.Rows?.find(
        row => row.CustomerCode === String(pin).trim(),
      );
      if (!client) {
        return rejectWithValue({
          Message: 'Invalid customer code',
          message: 'Invalid customer code',
        });
      }
      return client;
    } catch (error) {
      return rejectWithValue(toRejectValue(error));
    }
  },
);

export const verifyPinSlice = createSlice({
  name: 'verifyPinSlice',
  initialState: {loading: false, error: null, connString: null, message: ''},
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(verifyPinAction.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPinAction.fulfilled, (state, action) => {
        state.loading = false;
        state.connString = action.payload.ClientConnString;
      })
      .addCase(verifyPinAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = action.payload?.message;
      });
  },
});

export default verifyPinSlice.reducer;
