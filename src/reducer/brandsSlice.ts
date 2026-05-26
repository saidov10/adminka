import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { axiosRequest } from '../utils/token';

export interface Brand {
  id: number;
  brandName: string;
}

interface BrandState {
  brands: Brand[];
  searchQuery: string;
  loading: boolean;
  error: string | null;
}

const initialState: BrandState = {
  brands: [],
  searchQuery: '',
  loading: false,
  error: null,
};

export const fetchBrands = createAsyncThunk(
  'brands/fetchBrands',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosRequest.get('/api/Brand/get-brands');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Не удалось загрузить бренды';
      return rejectWithValue(errorMessage);
    }
  }
);

export const addBrand = createAsyncThunk(
  'brands/addBrand',
  async (brandName: string, { rejectWithValue }) => {
    try {
      const response = await axiosRequest.post('/api/Brand/add-brand', { brandName });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Не удалось добавить бренд';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateBrand = createAsyncThunk(
  'brands/updateBrand',
  async (brandData: Brand, { rejectWithValue }) => {
    try {
      const response = await axiosRequest.put('/api/Brand/update-brand', brandData);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Не удалось обновить бренд';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteBrand = createAsyncThunk(
  'brands/deleteBrand',
  async (id: number, { rejectWithValue }) => {
    try {
      await axiosRequest.delete(`/api/Brand/delete-brand?id=${id}`);
      return id;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Не удалось удалить бренд';
      return rejectWithValue(errorMessage);
    }
  }
);

const brandsSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {
    clearBrandError: (state) => {
      state.error = null;
    },
    setBrandSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const payloadData = action.payload?.data || action.payload;
        state.brands = payloadData?.brands || payloadData || [];
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBrand.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const newBrand = action.payload?.data || action.payload;
        if (newBrand) {
          state.brands.unshift(newBrand);
        }
      })
      .addCase(addBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBrand.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const updatedBrand = action.payload?.data || action.payload;
        if (updatedBrand) {
          state.brands = state.brands.map((b) =>
            b.id === updatedBrand.id ? updatedBrand : b
          );
        }
      })
      .addCase(updateBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBrand.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        const deletedId = action.payload;
        state.brands = state.brands.filter((b) => b.id !== deletedId);
      })
      .addCase(deleteBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearBrandError, setBrandSearchQuery } = brandsSlice.actions;
export default brandsSlice.reducer;