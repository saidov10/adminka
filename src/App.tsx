import { Suspense } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Dashboard, Layout, Login, Orders, Brands, Categories, Banners, AddProducts, Products } from "./router/router";
import { getToken } from "./utils/token";
import { Toaster } from "./components/ui/toast";


const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = getToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};


const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const token = getToken();
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

export default function App() {
 const router=createBrowserRouter([
  {
    path:"/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    )
  },
  {
    path:"/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children:[
      {
        index: true,
        element: <Navigate to="/dashboard" replace />
      },
      {
        path:"/dashboard",
        element:<Dashboard/>
      },
      {
        path:"/orders",
        element:<Orders/>
      },
      {
        path:"/brands",
        element:<Brands/>
      },
      {
        path:"/categories",
        element:<Categories/>
      },
      {
        path:"/banners",
        element:<Banners/>
      },
      {
        path:"/addproducts", 
        element:<AddProducts/>
      },
      {
        path:"/products", 
        element:<Products/>
      }
    ]
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
 ])

  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent shadow-md"></div>
          <p className="text-sm font-medium tracking-wide text-slate-400 animate-pulse">Loading fastcart...</p>
        </div>
      </div>
    }>
      <RouterProvider router={router} />
      <Toaster />
    </Suspense>
  )
}


