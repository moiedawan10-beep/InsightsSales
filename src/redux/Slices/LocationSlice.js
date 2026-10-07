import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {fetchData, toRejectValue} from '../../api/client';
import {locations} from '../../constants/endpoints';

export const LocationAction = createAsyncThunk(
  'LocationAction',
  async (_, {rejectWithValue}) => {
    try {
      return await fetchData(locations);
    } catch (error) {
      return rejectWithValue(toRejectValue(error));
    }
  },
);

export const LocationSlice = createSlice({
  name: 'LocationSlice',
  initialState: {
    loading: false,
    error: null,
    locations: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(LocationAction.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(LocationAction.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.locations = action.payload.Rows;
      })
      .addCase(LocationAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default LocationSlice.reducer;
