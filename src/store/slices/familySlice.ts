'use client';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '@/lib/api';
import {
  DashboardStats,
  Family,
  FamilyFilters,
  FilterOptions,
  Pagination,
} from '@/types';

interface FamilyState {
  list: Family[];
  current: Family | null;
  stats: DashboardStats | null;
  filterOptions: FilterOptions | null;
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
}

const initialState: FamilyState = {
  list: [],
  current: null,
  stats: null,
  filterOptions: null,
  pagination: null,
  loading: false,
  error: null,
};

export const fetchFamilies = createAsyncThunk(
  'families/fetchAll',
  async (filters: FamilyFilters, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') params.set(key, String(value));
      });
      const res = await api.get(`/api/families?${params.toString()}`);
      return res.data as { data: Family[]; pagination: Pagination };
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch families');
    }
  }
);

export const fetchFamilyById = createAsyncThunk(
  'families/fetchOne',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/families/${id}`);
      return res.data.data as Family;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch family');
    }
  }
);

export const fetchStats = createAsyncThunk('families/stats', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/api/families/stats');
    return res.data.data as DashboardStats;
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
  }
});

export const fetchFilterOptions = createAsyncThunk(
  'families/filters',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/families/filters');
      return res.data.data as FilterOptions;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch filters');
    }
  }
);

export const updateFamily = createAsyncThunk(
  'families/update',
  async ({ id, data }: { id: string; data: Partial<Family> }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/families/${id}`, data);
      return res.data.data as Family;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed to update family');
    }
  }
);

export const deleteFamily = createAsyncThunk(
  'families/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/api/families/${id}`);
      return id;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed to delete family');
    }
  }
);

const familySlice = createSlice({
  name: 'families',
  initialState,
  reducers: {
    clearCurrentFamily: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFamilies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFamilies.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchFamilies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchFamilyById.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchFilterOptions.fulfilled, (state, action) => {
        state.filterOptions = action.payload;
      })
      .addCase(updateFamily.fulfilled, (state, action) => {
        state.current = action.payload;
        state.list = state.list.map((f) => (f._id === action.payload._id ? action.payload : f));
      })
      .addCase(deleteFamily.fulfilled, (state, action) => {
        state.list = state.list.filter((f) => f._id !== action.payload);
      });
  },
});

export const { clearCurrentFamily } = familySlice.actions;
export default familySlice.reducer;
