import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import userReducer from '../reducer/userSlice'; 
import productReducer from '../reducer/productSlice';
import categoryReducer from '../reducer/categorySlice';
import brandReducer from '../reducer/brandsSlice';
export const store = configureStore({
  reducer: {
    users: userReducer,  
    products: productReducer,
    categories: categoryReducer,
    brands: brandReducer,
  },
  
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;