import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Search, Plus, Pencil, Trash2, Upload, ChevronLeft, ChevronRight, Laptop } from 'lucide-react';
import type { AppDispatch } from '../store/store';
import {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  setCategorySearchQuery,
  type Category
} from '../reducer/categorySlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 15;

export default function CategoriesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { categories, searchQuery, loading } = useSelector((state: any) => state.categories);

  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const uniqueCategories = categories.filter(
    (value: Category, index: number, self: Category[]) =>
      self.findIndex((c) => c.categoryName === value.categoryName) === index
  );

  const filteredCategories = uniqueCategories.filter((cat: Category) =>
    cat.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE) || 1;
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);

  const formik = useFormik({
    initialValues: {
      categoryName: '',
    },
    validationSchema: Yup.object({
      categoryName: Yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append('CategoryName', values.categoryName);
      if (imageFile) {
        formData.append('CategoryImage', imageFile);
      }

      if (selectedCategory) {
        formData.append('Id', String(selectedCategory.id));
        dispatch(updateCategory(formData))
          .unwrap()
          .then(() => closeFormModal());
      } else {
        dispatch(addCategory(formData))
          .unwrap()
          .then(() => closeFormModal());
      }
    },
  });

  const handleOpenAdd = () => {
    setSelectedCategory(null);
    formik.resetForm();
    setImageFile(null);
    setImagePreview(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setSelectedCategory(category);
    formik.setValues({ categoryName: category.categoryName });
    setImageFile(null);
    setImagePreview(category.categoryImage);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteOpen(true);
  };

  const closeFormModal = () => {
    setIsFormOpen(false);
    setSelectedCategory(null);
    formik.resetForm();
    setImageFile(null);
    setImagePreview(null);
  };

  const handleDeleteConfirm = () => {
    if (selectedCategory) {
      dispatch(deleteCategory(selectedCategory.id))
        .unwrap()
        .then(() => {
          setIsDeleteOpen(false);
          setSelectedCategory(null);
          if (currentItems.length === 1 && currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
          }
        });
    }
  };

  const navigate = useNavigate()
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-6 border-b border-slate-100 dark:border-slate-800 pb-2">
          <button className="text-blue-600 dark:text-blue-500 font-medium border-b-2 border-blue-600 dark:border-blue-500 pb-2 px-1 text-sm">Categories</button>
          <button onClick={() => navigate('/brands')} className="text-slate-400 dark:text-slate-500 font-medium pb-2 px-1 text-sm">Brands</button>
          <button onClick={() => navigate('/banners')} className="text-slate-400 dark:text-slate-500 font-medium pb-2 px-1 text-sm">Banners</button>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add new
        </button>
      </div>

      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => {
            dispatch(setCategorySearchQuery(e.target.value));
            setCurrentPage(1);
          }}
          className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
      </div>

      {loading && filteredCategories.length === 0 ? (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400 text-sm">Loading categories...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {currentItems.map((cat: Category) => (
            <div key={cat.id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center relative group bg-white dark:bg-slate-900 shadow-sm">
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleOpenDelete(cat)}
                  className="p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-red-500 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 mb-4 border border-slate-100 dark:border-slate-700 overflow-hidden">
                {cat.categoryImage && cat.categoryImage.trim() !== '' ? (
                  <img src={cat.categoryImage} alt={cat.categoryName} className="w-full h-full object-cover" />
                ) : (
                  <Laptop className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                )}
              </div>

              <span className="text-sm font-medium text-slate-800 dark:text-slate-200 text-center truncate w-full">
                {cat.categoryName}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6 mt-8">
        <div className="flex gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                currentPage === page
                  ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900'
                  : 'border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </button>
        </div>
        <span className="text-sm text-slate-500 dark:text-slate-400">{filteredCategories.length} Results</span>
      </div>

      <Dialog open={isFormOpen} onOpenChange={(open) => !open && closeFormModal()}>
        <DialogContent className="sm:max-w-[480px] p-6 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {selectedCategory ? 'Edit category' : 'Add category'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={formik.handleSubmit} className="space-y-5 pt-2">
            <div>
              <input
                type="text"
                placeholder="Category name"
                {...formik.getFieldProps('categoryName')}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  formik.touched.categoryName && formik.errors.categoryName 
                    ? 'border-red-500' 
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              />
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl py-8 px-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              {imagePreview && imagePreview.trim() !== '' ? (
                <div className="w-20 h-20 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-2">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 mb-2">
                  <Upload className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                </div>
              )}
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                <span className="text-blue-600 dark:text-blue-400 underline">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">SVG, JPG, PNG, or gif maximum 900×400</p>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={closeFormModal}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-lg text-sm font-medium shadow-sm"
              >
                {selectedCategory ? 'Save' : 'Create'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[440px] p-6 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">Delete product</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-2">
            <p className="text-sm text-slate-600 dark:text-slate-400">Are you sure you want to delete this product?</p>
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