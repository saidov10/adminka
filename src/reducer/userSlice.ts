import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { axiosRequest } from '../utils/token'; 

export interface UserRole {
  id: number;
  name: string;
}

export interface UserProfile {
  userId: number;
  userName: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phoneNumber: string | null;
  dob: string | null;
  image: string | null;
  userRoles: UserRole[];
}

interface UserState {
  users: UserProfile[];
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  totalRecords: 0,
  totalPages: 0,
  currentPage: 1,
  loading: false,
  error: null,
};

export const fetchUserProfiles = createAsyncThunk(
  'users/fetchUserProfiles',
  async (_, { rejectWithValue }) => {
    try {

      const response = await axiosRequest.get('/api/UserProfile/get-user-profiles');

      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Не удалось загрузить пользователей';
      return rejectWithValue(errorMessage);
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

      .addCase(fetchUserProfiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchUserProfiles.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;

        
        const payloadData = action.payload?.data || action.payload;

        state.users = payloadData?.userProfiles || [];
        state.totalRecords = payloadData?.totalRecords || 0;
        state.totalPages = payloadData?.totalPages || 0;
        state.currentPage = payloadData?.currentPage || 1;
      })
      
      .addCase(fetchUserProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;