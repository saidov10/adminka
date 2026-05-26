import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { axiosRequest } from '../utils/token';

export interface SubCategory {
  id: number;
  subCategoryName: string;
  categoryId: number;
}

export interface Category {
  id: number;
  categoryName: string;
  categoryImage: string | null;
  subCategories: SubCategory[];
}

interface CategoryState {
  categories: Category[];
  searchQuery: string;
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  searchQuery: '',
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosRequest.get('/api/Category/get-categories');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Не удалось загрузить категории';
      return rejectWithValue(errorMessage);
    }
  }
);

export const addCategory = createAsyncThunk(
  'categories/addCategory',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await axiosRequest.post('/api/Category/add-category', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Не удалось добавить категорию';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await axiosRequest.put('/api/Category/update-category', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Не удалось обновить категорию';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id: number, { rejectWithValue }) => {
    try {
      await axiosRequest.delete(`/api/Category/delete-category?id=${id}`);
      return id;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Не удалось удалить категорию';
      return rejectWithValue(errorMessage);
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },
    setCategorySearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.categories = action.payload?.data || action.payload || [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const newCategory = action.payload?.data || action.payload;
        if (newCategory) {
          state.categories.unshift(newCategory);
        }
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const updatedCategory = action.payload?.data || action.payload;
        if (updatedCategory) {
          state.categories = state.categories.map((cat) =>
            cat.id === updatedCategory.id ? updatedCategory : cat
          );
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        const deletedId = action.payload;
        state.categories = state.categories.filter((cat) => cat.id !== deletedId);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCategoryError, setCategorySearchQuery } = categorySlice.actions;
export default categorySlice.reducer;