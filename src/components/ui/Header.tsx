import React from 'react';
import { Bell, ChevronDown, Search, LogOut, User, Settings, Sun, Moon, Laptop } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { removeToken } from '../../utils/token';
import { useTheme } from '@/components/ui/teheme-provider';
import logo from '../../assets/Group 1116606595 (3).png';

interface UserProfileProps {
  user: {
    userId: number;
    userName: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    image: string | null;
  } | null;
}

export default function Header({ user }: UserProfileProps) {
  const navigate = useNavigate();
  const { setTheme, theme } = useTheme();

  const getInitials = () => {
    if (!user) return 'A';
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.firstName) return user.firstName[0].toUpperCase();
    return user.userName ? user.userName[0].toUpperCase() : 'A';
  };

  const displayName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user?.firstName || user?.userName || 'Admin';

  const imageUrl = user?.image ? `https://fastcard-1-o23z.onrender.com/images/${user.image}` : '';

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };
 
  return (
    <header className="h-20 w-full bg-[#1c2434] dark:bg-[#0b111b] text-white flex items-center justify-between px-4 md:px-12 shadow-md border-b border-slate-800 select-none">
      <div className="flex items-center flex-shrink-0">
        <img 
          src={logo} 
          onClick={() => navigate("/dashboard")} 
          className="w-32 h-12 md:w-44 md:h-16 object-contain cursor-pointer" 
          alt="FastCart Logo" 
        />
      </div>

      <div className="hidden md:flex items-center relative w-full max-w-[320px] lg:max-w-[400px] mx-4">
        <Search className="absolute left-3 w-5 h-5 text-slate-400 pointer-events-none" />
        <Input 
          type="text" 
          placeholder="Search..." 
          className="w-full h-10 bg-transparent border-none pl-11 text-slate-200 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
        />
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-[#24304c] hover:bg-[#313d5a] text-slate-200 hover:text-white border border-slate-700/40 transition-all focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer flex-shrink-0"
            >
              <Sun className="h-[1.1rem] w-[1.1rem] md:h-[1.15rem] md:w-[1.15rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.1rem] w-[1.1rem] md:h-[1.15rem] md:w-[1.15rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#1e293b] border-slate-700 text-slate-200 shadow-xl rounded-md">
            <DropdownMenuItem 
              onClick={() => setTheme("light")}
              className={`cursor-pointer focus:bg-slate-800 focus:text-white ${theme === "light" ? "bg-slate-800 text-white" : ""}`}
            >
              <Sun className="mr-2 h-4 w-4" />
              <span>Light</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setTheme("dark")}
              className={`cursor-pointer focus:bg-slate-800 focus:text-white ${theme === "dark" ? "bg-slate-800 text-white" : ""}`}
            >
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setTheme("system")}
              className={`cursor-pointer focus:bg-slate-800 focus:text-white ${theme === "system" ? "bg-slate-800 text-white" : ""}`}
            >
              <Laptop className="mr-2 h-4 w-4" />
              <span>System</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button className="relative p-1.5 text-slate-300 hover:text-white transition-colors flex-shrink-0">
          <Bell className="w-5 h-5 stroke-[2]" />
          <span className="absolute top-0.5 right-0.5 bg-blue-600 text-white text-[9px] md:text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#1c2434]">
            5
          </span>
        </button>

        <div className="hidden sm:block h-6 w-[1px] bg-slate-700 flex-shrink-0" />

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 md:gap-3 hover:opacity-90 transition-opacity focus:outline-none cursor-pointer flex-shrink-0">
            <Avatar className="h-9 w-9 md:h-10 md:w-10 border-2 border-emerald-400">
              <AvatarImage src={imageUrl} alt={displayName} className="object-cover" />
              <AvatarFallback className="bg-emerald-500 text-white font-bold text-xs md:text-sm">
                {getInitials()}
              </AvatarFallback>
            </Avatar>

            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm font-medium text-slate-200 tracking-wide max-w-[100px] truncate">
                {displayName}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-52 md:w-56 mt-2 bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 shadow-xl rounded-md text-slate-900 dark:text-zinc-100">
            <DropdownMenuLabel className="text-slate-400 dark:text-slate-500 text-xs font-normal px-3 py-2 truncate">
              {user?.email || 'admin@fastcard.tj'}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-100 dark:bg-zinc-800" />
            
            <DropdownMenuItem className="cursor-pointer flex items-center gap-2 px-3 py-2.5 text-sm focus:bg-slate-50 dark:focus:bg-zinc-800">
              <User className="w-4 h-4 text-slate-400" />
              <span>My Profile</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer flex items-center gap-2 px-3 py-2.5 text-sm focus:bg-slate-50 dark:focus:bg-zinc-800">
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Settings</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-slate-100 dark:bg-zinc-800" />
            
            <DropdownMenuItem 
              onClick={handleLogout}
              className="cursor-pointer flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/30 font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}