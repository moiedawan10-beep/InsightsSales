import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {AUTH_BASE_URL, login} from '../../constants/endpoints';
import {toRejectValue} from '../../api/client';

const SESSION_MINUTES = 60 * 24;

const initialState = {
  loading: false,
  error: null,
  accessToken: null,
  user: null,
  message: '',
};

export const loginUser = createAsyncThunk('loginUser', async (payload, thunkAPI) => {
  const {rejectWithValue} = thunkAPI;
  try {
    const response = await axios({
      method: 'POST',
      url: `${AUTH_BASE_URL}${login}`,
      headers: {'Content-Type': 'application/json'},
      data: {
        username: payload?.username?.trim(),
        password: payload?.password,
        expiresInMins: SESSION_MINUTES,
      },
    });

    const {accessToken, refreshToken, ...UserInfo} = response.data;
    return {
      Access_Token: accessToken,
      Expires: new Date(Date.now() + SESSION_MINUTES * 60 * 1000).toISOString(),
      UserInfo,
    };
  } catch (error) {
    return rejectWithValue(toRejectValue(error));
  }
});

export const loginSlice = createSlice({
  name: 'loginSlice',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.UserInfo;
        state.accessToken = action.payload.Access_Token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'something went wrong';
        state.message = action.payload?.message || 'login failed';
      });
  },
});

export default loginSlice.reducer;
