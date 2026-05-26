import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { axiosRequest } from '../utils/token';

export interface Product {
  id: number;
  productName: string;
  code: string;
  description: string;
  price: number;
  discountPrice: number;
  hasDiscount: boolean;
  quantity: number;
  weight: string;
  size: string;
  image: string;
  images: string[];
  rating: number;
  brandId: number | null;
  colorId: number | null;
  subCategoryId: number | null;
  categoryId: number | null;
  categoryName: string | null;
}

interface ProductState {
  products: Product[];
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  sortBy: 'newest' | 'price-low' | 'price-high';
}

const initialState: ProductState = {
  products: [],
  totalRecords: 0,
  totalPages: 0,
  currentPage: 1,
  loading: false,
  error: null,
  searchQuery: '',
  sortBy: 'newest',
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosRequest.get('/api/Product/get-products');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Не удалось загрузить продукты';
      return rejectWithValue(errorMessage);
    }
  }
);

export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await axiosRequest.post('/api/Product/add-product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Не удалось добавить продукт';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: number, { rejectWithValue }) => {
    try {
      await axiosRequest.delete(`/api/Product/delete-product?id=${id}`);
      return id;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Не удалось удалить продукт';
      return rejectWithValue(errorMessage);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'newest' | 'price-low' | 'price-high'>) => {
      state.sortBy = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const payloadData = action.payload?.data || action.payload;
        
        state.products = payloadData?.products || payloadData?.userProfiles || payloadData || [];
        state.totalRecords = payloadData?.totalRecords || 0;
        state.totalPages = payloadData?.totalPages || 0;
        state.currentPage = payloadData?.currentPage || 1;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const newProduct = action.payload?.data || action.payload;
        
        if (newProduct) {
          state.products.unshift(newProduct);
          state.totalRecords += 1;
        }
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        const deletedId = action.payload;
        
        state.products = state.products.filter((product) => product.id !== deletedId);
        
        if (state.totalRecords > 0) {
          state.totalRecords -= 1;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProductError, setSearchQuery, setSortBy } = productSlice.actions;
export default productSlice.reducer;