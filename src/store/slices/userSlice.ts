'use client';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { CreateUserPayload, DeletedFamilyAudit, Pagination, UpdateUserPayload, User } from '@/types';

interface UserState {
  list: User[];
  deletedFamilies: DeletedFamilyAudit[];
  deletedPagination: Pagination | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  list: [],
  deletedFamilies: [],
  deletedPagination: null,
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk('users/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/api/users');
    return res.data.data as User[];
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
  }
});

export const createUser = createAsyncThunk(
  'users/create',
  async (payload: CreateUserPayload, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/users', payload);
      return res.data.data as User;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed to create user');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/update',
  async ({ id, data }: { id: string; data: UpdateUserPayload }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/api/users/${id}`, data);
      return res.data.data as User;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

export const deactivateUser = createAsyncThunk(
  'users/deactivate',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/api/users/${id}`);
      return id;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed to deactivate user');
    }
  }
);

export const fetchDeletedFamilies = createAsyncThunk(
  'users/deletedFamilies',
  async (page: number, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/families/deleted?page=${page}&limit=20`);
      return res.data as { data: DeletedFamilyAudit[]; pagination: Pagination };
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch audit log');
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.list = state.list.map((u) => (u.id === action.payload.id ? action.payload : u));
      })
      .addCase(deactivateUser.fulfilled, (state, action) => {
        state.list = state.list.map((u) =>
          u.id === action.payload ? { ...u, isActive: false } : u
        );
      })
      .addCase(fetchDeletedFamilies.fulfilled, (state, action) => {
        state.deletedFamilies = action.payload.data;
        state.deletedPagination = action.payload.pagination;
      });
  },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
