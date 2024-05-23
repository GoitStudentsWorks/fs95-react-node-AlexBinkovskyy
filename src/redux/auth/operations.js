import api from '../../Interceptors/api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

export const setAuthHeader = accessToken => {
  api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
};

const clearAuthHeader = () => {
  api.defaults.headers.common.Authorization = '';
};

export const signup = createAsyncThunk(
  'auth/signup',
  async (credentials, thunkAPI) => {
    try {
      const res = await api.post('/users/register', credentials);
      console.log(res);
      const text = res.data.user.message;
      toast.success(text);
      console.log(res.data.user.message);
      console.log(res.data);
      return res.data;
    } catch (error) {
      toast.error(`${error.response.data.message}`);

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const signin = createAsyncThunk(
  'auth/signin',
  async (credentials, thunkAPI) => {
    try {
      const res = await api.post('/users/login', credentials);
      setAuthHeader(res.data.accessToken);
      console.log(res);

      toast.success('Welcome to the AquaTrack');

      localStorage.setItem(
        `userId_${res.data.user._id}`,
        res.data.refreshToken
      );

      return res.data;
    } catch (error) {
      console.log(error);
      // toast.error(error.response.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const signout = createAsyncThunk('auth/signout', async (_, thunkAPI) => {
  try {
    await api.post('/users/logout');
    clearAuthHeader();
    toast.success('Signout success');
  } catch (error) {
    toast.error(error.response.data.message);

    return thunkAPI.rejectWithValue(error.message);
  }
});

export const resendMail = createAsyncThunk(
  'auth/resend',
  async (credentials, thunkAPI) => {
    try {
      const res = await api.post('/users/verify', credentials);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const recoverMail = createAsyncThunk(
  'auth/recoverMail',
  async (credentials, thunkAPI) => {
    try {
      const res = await api.post('/users/passrecovery', credentials);
      console.log(res);
      // toast.success(res.data.message, { progress: undefined });
    } catch (error) {
      console.log(error);
      toast.error(error.message);

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const recoverPass = createAsyncThunk(
  'auth/recoverPass',
  async (credentials, thunkAPI) => {
    try {
      console.log(credentials);
      const res = await api.patch('/users/passrecovery', credentials, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(res);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.message);

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const refreshUser = createAsyncThunk(
  'auth/refresh',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const persistedToken = state.auth.accessToken;

    if (persistedToken === null) {
      return thunkAPI.rejectWithValue('Unable to fetch user');
    }

    try {
      setAuthHeader(persistedToken);
      const res = await api.get('/users/current');
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateUserSettings = createAsyncThunk(
  'auth/updateSettings',
  async (formData, thunkAPI) => {
    try {
      const res = await api.put('/users/update', formData);
      toast.success('Settings updated successfully');
      return res.data;
    } catch (error) {
      toast.error('Failed to update settings. Please try again.');
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const refreshUserTokens = createAsyncThunk(
  'auth/refreshTokens',
  async (credentials, thunkAPI) => {
    try {
      const res = await api.post('users/refreshtoken/', credentials, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return res.data;
    } catch (error) {}
  }
);
