import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Pencil, Trash2 } from 'lucide-react';
import type { AppDispatch } from '../store/store';
import {
  fetchBrands,
  addBrand,
  updateBrand,
  deleteBrand,
  setBrandSearchQuery,
  type Brand
} from '../reducer/brandsSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';

export default function BrandsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  
  const { brands: rawBrands, searchQuery, loading } = useSelector((state: any) => state.brands);
  const brands = Array.isArray(rawBrands) 
    ? rawBrands 
    : (rawBrands?.data && Array.isArray(rawBrands.data) ? rawBrands.data : []);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  const filteredBrands = brands.filter((b: Brand) =>
    b?.brandName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formik = useFormik({
    initialValues: {
      brandName: '',
    },
    validationSchema: Yup.object({
      brandName: Yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      if (isEditing && selectedBrand) {
        dispatch(updateBrand({ id: selectedBrand.id, brandName: values.brandName }))
          .unwrap()
          .then(() => handleResetForm());
      } else {
        dispatch(addBrand(values.brandName))
          .unwrap()
          .then(() => handleResetForm());
      }
    },
  });

  const handleEditClick = (brand: Brand) => {
    setIsEditing(true);
    setSelectedBrand(brand);
    formik.setValues({ brandName: brand.brandName });
  };

  const handleDeleteClick = (brand: Brand) => {
    setSelectedBrand(brand);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedBrand) {
      dispatch(deleteBrand(selectedBrand.id))
        .unwrap()
        .then(() => {
          setIsDeleteOpen(false);
          setSelectedBrand(null);
        });
    }
  };

  const handleResetForm = () => {
    setIsEditing(false);
    setSelectedBrand(null);
    formik.resetForm();
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 transition-colors">
      <div className="flex gap-6 border-b border-slate-100 dark:border-slate-800 pb-2 mb-6">
        <button className="text-slate-400 dark:text-slate-500 font-medium pb-2 px-1 text-sm" onClick={() => navigate('/categories')}>Categories</button>
        <button onClick={() => navigate('/brands')} className="text-blue-600 dark:text-blue-500 font-medium border-b-2 border-blue-600 dark:border-blue-500 pb-2 px-1 text-sm">Brands</button>
        <button onClick={() => navigate('/banners')} className="text-slate-400 dark:text-slate-500 font-medium pb-2 px-1 text-sm">Banners</button>
      </div>

      <div className="mb-6 max-w-md">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => dispatch(setBrandSearchQuery(e.target.value))}
          className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="pb-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider w-3/4">Brands</th>
                <th className="pb-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading && filteredBrands.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-8 text-center text-sm text-slate-400 dark:text-slate-500">
                    Loading brands...
                  </td>
                </tr>
              ) : filteredBrands.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-8 text-center text-sm text-slate-400 dark:text-slate-500">
                    No brands found
                  </td>
                </tr>
              ) : (
                filteredBrands.map((brand: Brand) => (
                  <tr key={brand.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 text-sm font-medium text-slate-800 dark:text-slate-200">
                      {brand.brandName}
                    </td>
                    <td className="py-3.5 text-right pr-2">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleEditClick(brand)}
                          className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(brand)}
                          className="p-1 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-800 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">
            {isEditing ? 'Edit brand' : 'Add new brand'}
          </h3>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Brand name"
                {...formik.getFieldProps('brandName')}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  formik.touched.brandName && formik.errors.brandName
                    ? 'border-red-500'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              />
            </div>
            <div className="flex gap-2 justify-end">
              {isEditing && (
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-lg text-sm font-medium shadow-sm"
              >
                {isEditing ? 'Save' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[440px] p-6 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">Delete brand</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-2">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Are you sure you want to delete this brand?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-lg text-sm font-medium shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2.5 border border-red-200 dark:border-red-900 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}