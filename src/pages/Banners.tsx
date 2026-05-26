import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Trash2, Clock, ChevronDown } from 'lucide-react';

interface BannerImage {
  id: string;
  name: string;
  preview: string;
}

export default function BannersPage() {
  const navigate = useNavigate();
  
  
  const sliderFileInputRef = useRef<HTMLInputElement>(null);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);

  
  const [sliders, setSliders] = useState<BannerImage[]>([
    { id: '1', name: 'Healthcare_Erbology.png', preview: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&q=80' },
    { id: '2', name: 'Healthcare_Erbology.png', preview: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&q=80' },
    { id: '3', name: 'Healthcare_Erbology.png', preview: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&q=80' },
  ]);
  const [sliderSubtitle, setSliderSubtitle] = useState('Enhance Your Music Experience');
  const [sliderTitle, setSliderTitle] = useState('Enhance Your Music Experience');

  
  const [bannerImages, setBannerImages] = useState<BannerImage[]>([
    { id: '1', name: 'Healthcare_Erbology.png', preview: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=150&q=80' }
  ]);
  const [bannerCategory, setBannerCategory] = useState('');
  const [bannerCountdown, setBannerCountdown] = useState('05d/23h/59m/35s');
  const [bannerTitle, setBannerTitle] = useState('Enhance Your Music Experience');

  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isSlider: boolean) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newImg: BannerImage = {
        id: String(Date.now()),
        name: file.name,
        preview: URL.createObjectURL(file)
      };
      if (isSlider) {
        setSliders(prev => [...prev, newImg]);
      } else {
        setBannerImages([newImg]); 
      }
    }
  };

  const removeImage = (id: string, isSlider: boolean) => {
    if (isSlider) {
      setSliders(prev => prev.filter(img => img.id !== id));
    } else {
      setBannerImages([]);
    }
  };

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 transition-colors">
      
      
      <div className="flex gap-6 border-b border-slate-200 dark:border-slate-800 pb-2 mb-8">
        <button 
          onClick={() => navigate('/categories')} 
          className="text-slate-400 dark:text-slate-500 font-medium pb-2 px-1 text-sm hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          Categories
        </button>
        <button 
          onClick={() => navigate('/brands')} 
          className="text-slate-400 dark:text-slate-500 font-medium pb-2 px-1 text-sm hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          Brands
        </button>
        <button 
          onClick={() => navigate('/banners')} 
          className="text-blue-600 dark:text-blue-500 font-medium border-b-2 border-blue-600 dark:border-blue-500 pb-2 px-1 text-sm"
        >
          Banners
        </button>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-7xl">
        
        
        <div className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-500">Main sliders</h2>
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
            
            
            <div 
              onClick={() => sliderFileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl py-8 px-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-3">
                <Upload className="w-5 h-5 text-slate-500" />
              </div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="text-blue-600 dark:text-blue-400 underline">Click to upload</span> or drag and drop
              </p>
              <p className="text-[10px] text-slate-400 mt-1">SVG, JPG, PNG, or gif maximum 900×400</p>
              <input 
                ref={sliderFileInputRef}
                type="file" 
                accept="image/*"
                onChange={(e) => handleImageUpload(e, true)}
                className="hidden" 
              />
            </div>

            
            {sliders.length > 0 && (
              <div className="overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-800/60">
                      <th className="pb-2 font-medium w-20">Image</th>
                      <th className="pb-2 font-medium">File name</th>
                      <th className="pb-2 font-medium text-right pr-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {sliders.map((img) => (
                      <tr key={img.id} className="text-slate-700 dark:text-slate-300">
                        <td className="py-3">
                          <div className="w-12 h-9 rounded bg-slate-900 border dark:border-slate-800 overflow-hidden flex items-center justify-center">
                            <img src={img.preview} alt="slider item" className="w-full h-full object-contain" />
                          </div>
                        </td>
                        <td className="py-3 font-medium text-sm text-slate-500 dark:text-slate-400">
                          {img.name}
                        </td>
                        <td className="py-3 text-right pr-2">
                          <button
                            type="button"
                            onClick={() => removeImage(img.id, true)}
                            className="p-1 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            
            <div className="space-y-5 pt-2">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white dark:bg-slate-900 px-1 text-[11px] font-medium text-slate-400 transition-all">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={sliderSubtitle}
                  onChange={(e) => setSliderSubtitle(e.target.value)}
                  className="w-full border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white dark:bg-slate-900 px-1 text-[11px] font-medium text-slate-400 transition-all">
                  Title
                </label>
                <input
                  type="text"
                  value={sliderTitle}
                  onChange={(e) => setSliderTitle(e.target.value)}
                  className="w-full border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 dark:text-slate-200"
                />
              </div>

              
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-lg text-sm font-medium shadow-sm transition-colors"
                >
                  Save
                </button>
              </div>
            </div>

          </div>
        </div>

        
        <div className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-500">Banner</h2>
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
            
            
            <div 
              onClick={() => bannerFileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl py-8 px-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-3">
                <Upload className="w-5 h-5 text-slate-500" />
              </div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="text-blue-600 dark:text-blue-400 underline">Click to upload</span> or drag and drop
              </p>
              <p className="text-[10px] text-slate-400 mt-1">SVG, JPG, PNG, or gif maximum 900×400</p>
              <input 
                ref={bannerFileInputRef}
                type="file" 
                accept="image/*"
                onChange={(e) => handleImageUpload(e, false)}
                className="hidden" 
              />
            </div>

            
            {bannerImages.length > 0 && (
              <div className="overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-800/60">
                      <th className="pb-2 font-medium w-20">Image</th>
                      <th className="pb-2 font-medium">File name</th>
                      <th className="pb-2 font-medium text-right pr-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {bannerImages.map((img) => (
                      <tr key={img.id} className="text-slate-700 dark:text-slate-300">
                        <td className="py-3">
                          <div className="w-12 h-9 rounded bg-slate-900 border dark:border-slate-800 overflow-hidden flex items-center justify-center">
                            <img src={img.preview} alt="banner item" className="w-full h-full object-contain" />
                          </div>
                        </td>
                        <td className="py-3 font-medium text-sm text-slate-500 dark:text-slate-400">
                          {img.name}
                        </td>
                        <td className="py-3 text-right pr-2">
                          <button
                            type="button"
                            onClick={() => removeImage(img.id, false)}
                            className="p-1 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            
            <div className="space-y-5 pt-2">
              
              
              <div className="relative">
                <select
                  value={bannerCategory}
                  onChange={(e) => setBannerCategory(e.target.value)}
                  className="w-full border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-400 appearance-none cursor-pointer"
                >
                  <option value="" disabled hidden>Categories</option>
                  <option value="electronics" className="text-slate-800 dark:text-slate-200">Electronics</option>
                  <option value="clothes" className="text-slate-800 dark:text-slate-200">Clothes</option>
                  <option value="music" className="text-slate-800 dark:text-slate-200">Music & Audio</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>

              
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={bannerCountdown}
                  onChange={(e) => setBannerCountdown(e.target.value)}
                  className="w-full border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg pl-3 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 dark:text-slate-200 font-mono tracking-wide"
                />
                <div className="absolute right-3 text-slate-400">
                  <Clock className="w-4 h-4" />
                </div>
              </div>

              
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white dark:bg-slate-900 px-1 text-[11px] font-medium text-slate-400 transition-all">
                  Title
                </label>
                <input
                  type="text"
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  className="w-full border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 dark:text-slate-200"
                />
              </div>

              
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-lg text-sm font-medium shadow-sm transition-colors"
                >
                  Save
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}