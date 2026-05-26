import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { addProduct } from '../reducer/productSlice';
import type { AppDispatch } from '../store/store';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { id: 1, name: 'Toys' },
  { id: 2, name: 'Sports' },
  { id: 3, name: 'Home & Garden' },
  { id: 4, name: 'Fashion' },
  { id: 5, name: 'Electronics' },
];

const BRANDS = [
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Sony' },
  { id: 3, name: 'Adidas' },
  { id: 4, name: 'Nike' },
  { id: 5, name: 'Samsung' },
  { id: 6, name: 'LG' },
  { id: 7, name: 'Readmi' },
  { id: 8, name: 'Huawei' },
];

const COLORS = [
  { id: 1, name: 'Blue', class: 'bg-blue-400' },
  { id: 2, name: 'Red', class: 'bg-red-400' },
  { id: 3, name: 'Purple', class: 'bg-indigo-500' },
  { id: 4, name: 'Yellow', class: 'bg-amber-400' },
  { id: 5, name: 'Green', class: 'bg-emerald-500' },
  { id: 6, name: 'Dark', class: 'bg-slate-700' },
];

export default function AddProductPage() {
  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const validationSchema = Yup.object({
    productName: Yup.string().required('Product name is required'),
    code: Yup.string().required('Code/SKU is required'),
    description: Yup.string().required('Description is required'),
    price: Yup.number().positive('Must be positive').required('Price is required'),
    discountPrice: Yup.number().min(0, 'Cannot be negative'),
    quantity: Yup.number().integer().min(0).required('Count is required'),
    categoryId: Yup.number().required('Category is required'),
    brandId: Yup.number().required('Brand is required'),
    colorId: Yup.number().required('Please select a color'),
    weight: Yup.string(),
    size: Yup.string(),
  });
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      productName: '',
      code: '',
      description: '',
      price: '',
      discountPrice: '',
      hasDiscount: false,
      quantity: '',
      categoryId: '',
      brandId: '',
      colorId: null as number | null,
      weight: '',
      size: '',
    },
    validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      
      formData.append('ProductName', values.productName);
      formData.append('Code', values.code);
      formData.append('Description', values.description);
      formData.append('Price', values.price);
      formData.append('DiscountPrice', values.hasDiscount ? values.discountPrice : '0');
      formData.append('HasDiscount', String(values.hasDiscount));
      formData.append('Quantity', values.quantity);
      formData.append('CategoryId', values.categoryId);
      formData.append('BrandId', values.brandId);
      formData.append('ColorId', String(values.colorId));
      formData.append('Weight', values.weight || '');
      formData.append('Size', values.size || '');

      selectedImages.forEach((file) => {
        formData.append('Images', file);
      });

      dispatch(addProduct(formData))
        .unwrap()
        .then(() => {
          alert('Product added successfully!');
          navigate('/products');
          formik.resetForm();
          setSelectedImages([]);
        })
        .catch((err) => {
          alert(`Error: ${err}`);
        });
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      setSelectedImages((prevImages) => [...prevImages, ...filesArray].slice(0, 10));
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 text-slate-800">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <button type="button" className="text-slate-500 hover:text-slate-800">
            ←
          </button>
          <h1 className="text-xl font-bold text-slate-900">Products / Add new</h1>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              formik.resetForm();
              setSelectedImages([]);
            }}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => formik.handleSubmit()}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-sm"
          >
            Save
          </button>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold text-slate-900">Information</h2>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <input
                  type="text"
                  placeholder="Product name"
                  {...formik.getFieldProps('productName')}
                  className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formik.touched.productName && formik.errors.productName ? 'border-red-500' : 'border-slate-200'
                  }`}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Code"
                  {...formik.getFieldProps('code')}
                  className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formik.touched.code && formik.errors.code ? 'border-red-500' : 'border-slate-200'
                  }`}
                />
              </div>
            </div>

            <div>
              <textarea
                placeholder="Description"
                rows={4}
                {...formik.getFieldProps('description')}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formik.touched.description && formik.errors.description ? 'border-red-500' : 'border-slate-200'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <select
                  {...formik.getFieldProps('categoryId')}
                  className={`w-full rounded-lg border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formik.touched.categoryId && formik.errors.categoryId ? 'border-red-500' : 'border-slate-200'
                  }`}
                >
                  <option value="" disabled hidden>Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  {...formik.getFieldProps('brandId')}
                  className={`w-full rounded-lg border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formik.touched.brandId && formik.errors.brandId ? 'border-red-500' : 'border-slate-200'
                  }`}
                >
                  <option value="" disabled hidden>Brands</option>
                  {BRANDS.map((brand) => (
                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold text-slate-900">Price</h2>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <input
                  type="number"
                  placeholder="Product price"
                  {...formik.getFieldProps('price')}
                  className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formik.touched.price && formik.errors.price ? 'border-red-500' : 'border-slate-200'
                  }`}
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Discount"
                  disabled={!formik.values.hasDiscount}
                  {...formik.getFieldProps('discountPrice')}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Count"
                  {...formik.getFieldProps('quantity')}
                  className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formik.touched.quantity && formik.errors.quantity ? 'border-red-500' : 'border-slate-200'
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => formik.setFieldValue('hasDiscount', !formik.values.hasDiscount)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                  formik.values.hasDiscount ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    formik.values.hasDiscount ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-sm text-slate-600">Add discount for this product</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold text-slate-900">Options</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Size (e.g. M, L, XL)</label>
                <input
                  type="text"
                  placeholder="Size"
                  {...formik.getFieldProps('size')}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Weight (e.g. 0.5)</label>
                <input
                  type="text"
                  placeholder="Weight"
                  {...formik.getFieldProps('weight')}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Colour:</h2>
              <span className="text-xs text-blue-600 font-medium cursor-pointer">✓ Create new</span>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {COLORS.map((color) => {
                const isSelected = formik.values.colorId === color.id;
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => formik.setFieldValue('colorId', color.id)}
                    className={`h-8 w-8 rounded-full transition-all duration-150 ${color.class} ${
                      isSelected 
                        ? 'ring-4 ring-blue-600 ring-offset-2 scale-110 shadow-md' 
                        : 'hover:scale-105'
                    }`}
                    title={color.name}
                  />
                );
              })}
            </div>
            {formik.touched.colorId && formik.errors.colorId && (
              <p className="text-xs text-red-500 mt-1">{formik.errors.colorId}</p>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold text-slate-900">Images</h2>
            
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl py-8 px-4 text-center cursor-pointer hover:bg-slate-50/50 transition-colors"
            >
              <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 mb-2">
                ↑
              </div>
              <p className="text-sm font-medium text-slate-700">
                <span className="text-blue-600 underline">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-slate-400 mt-1">SVG, JPG, PNG, or GIF (max 10 files)</p>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {selectedImages.length > 0 && (
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <div className="grid grid-cols-3 text-xs font-semibold text-slate-400 pb-1">
                  <span>Image</span>
                  <span>File name</span>
                  <span className="text-right">Action</span>
                </div>
                
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {selectedImages.map((file, index) => {
                    const previewUrl = URL.createObjectURL(file);
                    return (
                      <div key={index} className="grid grid-cols-3 items-center text-sm text-slate-700 py-1 border-b border-slate-50">
                        <div className="h-12 w-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden">
                          <img src={previewUrl} alt="preview" className="h-full w-full object-cover" />
                        </div>
                        <span className="truncate text-xs font-medium text-slate-600" title={file.name}>
                          {file.name}
                        </span>
                        <div className="text-right">
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="text-red-500 hover:text-red-700 p-1 text-xs"
                          >
                            🗑
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}