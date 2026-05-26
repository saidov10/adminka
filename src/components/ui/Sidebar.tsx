import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { Home, Users, Tag, Folder } from "lucide-react";
import type { RootState } from "../../store/store";

export default function Sidebar() {
 
  const { totalRecords } = useSelector((state: RootState) => state.users);

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: Home,
    },
    {
      name: "Users",
      path: "/orders", 
      icon: Users,
      badge: totalRecords > 0 ? String(totalRecords) : undefined, 
    },
    {
      name: "Products",
      path: "/products",
      icon: Tag,
    },
    {
      name: "Other",
      path: "/categories",
      icon: Folder, 
    },
  ]; 

  return (
    <aside className="w-[260px] bg-[#1c2434] dark:bg-[#0b111b] border-r border-slate-800 flex flex-col h-full py-6 px-4 shrink-0 transition-colors duration-200">
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-lg transition-all duration-200 select-none cursor-pointer ${
                  isActive
                    ? "bg-white text-[#1c2434] dark:bg-zinc-100 dark:text-zinc-950 font-medium shadow-md"
                    : "text-slate-300 hover:bg-slate-800/40 hover:text-white"
                }`
              }
            >
              <Icon className="w-5 h-5 stroke-[1.8]" />
              <span className="text-sm font-medium tracking-wide">{item.name}</span>
              
             
              {item.badge && (
                <span className="ml-auto bg-[#0f172a] text-white dark:bg-zinc-800 text-[10px] font-semibold px-2 py-0.5 rounded-full min-w-5 text-center flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}