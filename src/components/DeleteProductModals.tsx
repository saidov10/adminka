import React from 'react';
import { X } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from 'lucide-react';

interface DeleteProductModalsProps {
  isSingleOpen: boolean;
  setIsSingleOpen: (open: boolean) => void;
  onConfirmSingle: () => void;
  
  isBulkOpen: boolean;
  setIsBulkOpen: (open: boolean) => void;
  onConfirmBulk: () => void;
  selectedCount: number;
}

export default function DeleteProductModals({
  isSingleOpen,
  setIsSingleOpen,
  onConfirmSingle,
  isBulkOpen,
  setIsBulkOpen,
  onConfirmBulk,
  selectedCount
}: DeleteProductModalsProps) {
  

  const contentClassName = "";

  return (
    <>
   
      <AlertDialog open={isSingleOpen} onOpenChange={setIsSingleOpen}>
        <AlertDialogContent className={contentClassName}>
          
          
          <button 
            onClick={() => setIsSingleOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 transition-colors"
          >
            <X size={18} />
          </button>

          <AlertDialogHeader className="text-left space-y-0">
            <AlertDialogTitle className="text-xl font-bold text-[#1F2937] dark:text-zinc-50 tracking-tight mb-3">
              Delete product
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base font-normal text-[#4B5563] dark:text-zinc-400 mb-6">
              Are you sure you want to delete this product?
            </AlertDialogDescription>
          </AlertDialogHeader>

          
          <AlertDialogFooter className="flex sm:flex-row items-center justify-end gap-3 w-full">
            <button
              onClick={() => setIsSingleOpen(false)}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-[4px] font-medium text-sm transition-colors"
            >
              Cancel
            </button>
            <AlertDialogAction 
              onClick={onConfirmSingle} 
              className="w-full sm:w-auto px-6 py-2.5  bg-red-50 text-[#d11a1a] border border-[#4d0303] dark:bg-zinc-950 dark:hover:bg-red-950/20 rounded-[4px] font-medium text-sm transition-colors shadow-none"
            >
            <Trash2  color='red' size={50}/>
            </AlertDialogAction>
          </AlertDialogFooter>   
        </AlertDialogContent>
      </AlertDialog>


      
      <AlertDialog open={isBulkOpen} onOpenChange={setIsBulkOpen}>
        <AlertDialogContent className={contentClassName}>
          
          
          <button 
            onClick={() => setIsBulkOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 transition-colors"
          >
            <X size={18} />
          </button>

          <AlertDialogHeader className="text-left space-y-0">
            <AlertDialogTitle className="text-xl font-bold text-[#1F2937] dark:text-zinc-50 tracking-tight mb-3">
              Delete Items
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base font-normal text-[#4B5563] dark:text-zinc-400 mb-6">
              Are you sure you want to delete {selectedCount} selected items?
            </AlertDialogDescription>
          </AlertDialogHeader>

          
          <AlertDialogFooter className="flex sm:flex-row items-center justify-end gap-3 w-full">
            <button
              onClick={() => setIsBulkOpen(false)}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-[4px] font-medium text-sm transition-colors"
            >
              Cancel
            </button>
            <button  
              onClick={onConfirmBulk}
              className="w-full sm:w-auto px-6 py-2.5 bg-white hover:bg-red-50 text-[#EF4444] border border-[#EF4444] dark:bg-zinc-950 dark:hover:bg-red-950/20 rounded-[4px] font-medium text-sm transition-colors shadow-none"
            >
              <Trash2/>
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}