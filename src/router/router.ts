import { lazy } from "react";

export const Products = lazy(() => import("../pages/Products"))
export const Login = lazy(() => import("../pages/Login"));
export const Layout = lazy(() => import("../pages/Layout"));
export const Dashboard = lazy(() => import("../pages/Dashboard"));
export const Orders = lazy(() => import("../pages/Orders"));
export const Brands = lazy(() => import("../pages/Brands"));
export const Categories = lazy(() => import("../pages/Categories"));
export const Banners = lazy(() => import("../pages/Banners"));
export const AddProducts = lazy(() => import("../pages/AddProducts"));

 

