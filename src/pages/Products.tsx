import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Search, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Edit3, 
  Trash2 
} from 'lucide-react';
import type { RootState, AppDispatch } from '../store/store';

import { 
  fetchProducts, 
  deleteProduct, 
  setSearchQuery, 
  setSortBy, 
  type Product 
} from '../reducer/productSlice'; 
import DeleteProductModals from '../components/DeleteProductModals';
import { useNavigate } from 'react-router-dom';

export default function ProductsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { products, totalRecords, loading, searchQuery, sortBy } = useSelector(
    (state: RootState) => state.products
  );

  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const itemsPerPage = 8; 

  const [isSingleDeleteOpen, setIsSingleDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSortDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const safeProducts: Product[] = Array.isArray(products) ? products : [];

  const filteredProducts = safeProducts.filter((product) => {
    const matchesSearch = 
      product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.code && product.code.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.hasDiscount ? a.discountPrice : a.price;
    const priceB = b.hasDiscount ? b.discountPrice : b.price;

    if (sortBy === 'price-low') {
      return priceA - priceB; 
    }
    if (sortBy === 'price-high') {
      return priceB - priceA; 
    }
    
    return b.id - a.id;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [sortedProducts.length, totalPages, currentPage]);

  const handleSelectProduct = (id: number) => {
    setSelectedProducts(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (currentItems.length > 0 && selectedProducts.length === currentItems.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(currentItems.map(p => p.id));
    }
  };

  const getProductImage = (imageName: string) => {
    if (!imageName) return 'https://via.placeholder.com/40';
    if (imageName.startsWith('http')) return imageName;
    
    const BASE_URL = import.meta.env.VITE_API_URL || '';
    return `${BASE_URL}/images/${imageName}`;
  };

  const getSortLabel = () => {
    if (sortBy === 'price-low') return 'Price: Low to High';
    if (sortBy === 'price-high') return 'Price: High to Low';
    return 'Newest';
  };

  const openSingleDeleteModal = (id: number) => {
    setProductToDelete(id);
    setIsSingleDeleteOpen(true);
  };

  const confirmSingleDelete = async () => {
    if (productToDelete !== null) {
      await dispatch(deleteProduct(productToDelete));
      setSelectedProducts(prev => prev.filter(id => id !== productToDelete));
      setProductToDelete(null);
      setIsSingleDeleteOpen(false);
    }
  };

  const confirmBulkDelete = async () => {
    if (selectedProducts.length === 0) return;
    await Promise.all(selectedProducts.map(id => dispatch(deleteProduct(id))));
    setSelectedProducts([]);
    setIsBulkDeleteOpen(false);
  };

  return (
    <div className="w-full min-h-screen bg-white dark:bg-zinc-950 p-4 md:p-8 text-black dark:text-white font-sans transition-colors duration-200">
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
        <button onClick={() => navigate('/addproducts')} className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2.5 rounded-[4px] font-medium text-sm transition-colors shadow-sm">
          <Plus size={16} />
          <span>Add product</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-4">
        <div className="flex flex-1 w-full sm:w-auto items-center gap-3">
          
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500" size={18} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => { 
                dispatch(setSearchQuery(e.target.value)); 
                setCurrentPage(1); 
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-zinc-800 bg-transparent rounded-[4px] text-sm focus:outline-none focus:border-[#2563EB] dark:focus:border-blue-500 transition-colors placeholder-gray-400 dark:placeholder-neutral-500"
            />
          </div>

          <div className="relative" ref={dropdownRef}>
            <div 
              onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              className="flex items-center gap-6 px-4 py-2 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-[4px] text-sm cursor-pointer select-none min-w-[140px]"
            >
              <span className="text-gray-400 text-[10px] font-normal absolute -top-2 left-2 bg-white dark:bg-zinc-950 px-1">Filter</span>
              <span className="font-medium text-zinc-800 dark:text-zinc-200">{getSortLabel()}</span>
              <ChevronDown size={16} className={`text-gray-400 ml-auto transition-transform duration-200 ${isSortDropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            {isSortDropdownOpen && (
              <div className="absolute left-0 mt-1 w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-[4px] shadow-lg z-20 py-1 text-sm text-zinc-700 dark:text-zinc-300 animate-in fade-in slide-in-from-top-1 duration-150">
                <button
                  onClick={() => { dispatch(setSortBy('newest')); setIsSortDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors ${sortBy === 'newest' ? 'font-semibold text-[#2563EB] dark:text-blue-400' : ''}`}
                >
                  Newest
                </button>
                <button
                  onClick={() => { dispatch(setSortBy('price-low')); setIsSortDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors ${sortBy === 'price-low' ? 'font-semibold text-[#2563EB] dark:text-blue-400' : ''}`}
                >
                  Price: Low to High
                </button>
                <button
                  onClick={() => { dispatch(setSortBy('price-high')); setIsSortDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors ${sortBy === 'price-high' ? 'font-semibold text-[#2563EB] dark:text-blue-400' : ''}`}
                >
                  Price: High to Low
                </button>
              </div>
            )}
          </div>
        </div>

        {selectedProducts.length > 0 && (
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end animate-in fade-in-50 duration-200">
            <button className="p-2 border border-gray-200 dark:border-zinc-800 rounded-[4px] text-gray-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors">
              <Edit3 size={18} />
            </button>
            <button 
              onClick={() => setIsBulkDeleteOpen(true)}
              className="p-2 border border-gray-200 dark:border-zinc-800 rounded-[4px] text-gray-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="w-full overflow-x-auto border border-gray-100 dark:border-zinc-900 rounded-[4px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-zinc-800 text-xs font-medium text-gray-400 dark:text-zinc-500 select-none bg-gray-50/50 dark:bg-zinc-900/30">
              <th className="py-3.5 px-4 w-12">
                <input
                  type="checkbox"
                  checked={currentItems.length > 0 && selectedProducts.length === currentItems.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-gray-300 dark:border-zinc-700 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                />
              </th>
              <th className="py-3.5 px-4 font-normal">Product</th>
              <th className="py-3.5 px-4 font-normal">Inventory</th>
              <th className="py-3.5 px-4 font-normal">Category</th>
              <th className="py-3.5 px-4 font-normal">Price</th>
              <th className="py-3.5 px-4 font-normal text-right pr-6">Action</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-900 text-sm font-normal text-zinc-700 dark:text-zinc-300">
            {loading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="py-4 px-4"><div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-4"></div></td>
                  <td className="py-4 px-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-zinc-800 rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-36"></div>
                  </td>
                  <td className="py-4 px-4"><div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-20"></div></td>
                  <td className="py-4 px-4"><div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-24"></div></td>
                  <td className="py-4 px-4"><div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-16"></div></td>
                  <td className="py-4 px-4"><div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-12 ml-auto"></div></td>
                </tr>
              ))
            ) : currentItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-400 dark:text-zinc-500">
                  No products found.
                </td>
              </tr>
            ) : (
              currentItems.map((product) => {
                const isChecked = selectedProducts.includes(product.id);
                const isOutOfStock = product.quantity === 0;

                return (
                  <tr 
                    key={product.id} 
                    className={`hover:bg-gray-50/50 dark:hover:bg-zinc-900/40 transition-colors ${
                      isChecked ? 'bg-blue-50/30 dark:bg-blue-950/10' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleSelectProduct(product.id)}
                        className="w-4 h-4 rounded border-gray-300 dark:border-zinc-700 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                      />
                    </td>

                    <td className="py-3 px-4 font-medium text-black dark:text-zinc-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 flex items-center justify-center p-0.5 overflow-hidden shrink-0">
                          <img 
                            src={getProductImage(product.image)} 
                            alt={product.productName} 
                            className="max-w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40';
                            }}
                          />
                        </div>
                        <div className="flex flex-col">
                          <span>{product.productName}</span>
                          {product.code && (
                            <span className="text-[11px] font-normal text-gray-400 dark:text-zinc-500">Code: {product.code}</span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {isOutOfStock ? (
                        <span className="px-2 py-0.5 rounded-[4px] text-xs font-medium bg-[#FFEBEE] text-[#C62828] dark:bg-rose-950/40 dark:text-rose-400">
                          Out of Stock
                        </span>
                      ) : (
                        <span className="text-zinc-700 dark:text-zinc-300">
                          {product.quantity} <span className="text-gray-400 dark:text-zinc-500 text-xs">in stock</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-zinc-500 dark:text-zinc-400">
                      {product.categoryName || 'General'}
                    </td>

                    <td className="py-3 px-4 font-medium text-black dark:text-zinc-100">
                      <div className="flex flex-col">
                        <span>${product.hasDiscount ? product.discountPrice : product.price}</span>
                        {product.hasDiscount && (
                          <span className="text-xs text-gray-400 dark:text-zinc-500 line-through font-normal">
                            ${product.price}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-3 text-gray-400 dark:text-zinc-500">
                        <button className="hover:text-[#2563EB] dark:hover:text-blue-400 transition-colors">
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => openSingleDeleteModal(product.id)}
                          className="hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 select-none">
        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 border border-gray-200 dark:border-zinc-800 rounded-[4px] hover:bg-gray-50 dark:hover:bg-zinc-900 text-gray-500 dark:text-zinc-400 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNum = index + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 flex items-center justify-center rounded-[4px] text-sm font-medium transition-colors ${
                  currentPage === pageNum
                    ? 'bg-[#EBF2FF] text-[#2563EB] dark:bg-blue-950 dark:text-blue-400'
                    : 'hover:bg-gray-50 dark:hover:bg-zinc-900 text-gray-600 dark:text-zinc-400'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || sortedProducts.length === 0}
            className="p-2 border border-gray-200 dark:border-zinc-800 rounded-[4px] hover:bg-gray-50 dark:hover:bg-zinc-900 text-gray-500 dark:text-zinc-400 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="text-sm font-medium text-gray-500 dark:text-zinc-400">
          {searchQuery ? sortedProducts.length : totalRecords} Results
        </div>
      </div>

      <DeleteProductModals 
        isSingleOpen={isSingleDeleteOpen}
        setIsSingleOpen={setIsSingleDeleteOpen}
        onConfirmSingle={confirmSingleDelete}
        isBulkOpen={isBulkDeleteOpen}
        setIsBulkOpen={setIsBulkDeleteOpen}
        onConfirmBulk={confirmBulkDelete}
        selectedCount={selectedProducts.length}
      />

    </div>
  );
}