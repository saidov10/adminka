import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { axiosRequest, saveToken, removeToken } from '../utils/token';
import { toast } from '../components/ui/toast';
import logo from '../assets/Group 1116606595 (3).png'

const validationSchema = Yup.object({
  userName: Yup.string()
    .min(4, 'Имя пользователя должно быть не менее 4 символов')
    .required('Имя пользователя обязательно для заполнения'),
  password: Yup.string()
    .min(6, 'Пароль должен быть не менее 6 символов')
    .required('Пароль обязателен для заполнения'),
});

interface UserRole {
  id: number;
  name: string;
}

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      userName: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        
        const response = await axiosRequest.post('api/Account/login', {
          userName: values.userName,
          password: values.password,
        });

        const token = response.data?.token || response.data?.data?.token || response.data;
        if (!token) {
          throw new Error('Токен не получен от сервера');
        }
        saveToken(token);

       
        const profileResponse = await axiosRequest.get('api/UserProfile/get-user-profiles');
        const profileData = profileResponse.data?.data || profileResponse.data;

         
        const currentProfile = profileData?.userProfiles ? profileData.userProfiles[0] : profileData;
        const rolesArray: UserRole[] = currentProfile?.userRoles || [];

      
        const isAdmin = rolesArray.some(
          (role: UserRole) =>
            role.name?.toLowerCase() === 'admin' ||
            role.name?.toLowerCase() === 'superadmin'
        );

        if (isAdmin) {
          toast({
            title: 'Вход выполнен',
            description: 'Добро пожаловать в админ-панель!',
            variant: 'success',
          });
          navigate('/dashboard');
        } else {
        
          removeToken();
          toast({
            title: 'Ошибка доступа',
            description: 'У вас нет прав администратора для входа в панель.',
            variant: 'destructive',
          });
        }
      } catch (error: any) {
        console.error('Ошибка входа:', error);
        removeToken();
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.Error ||
          'Неправильное имя пользователя или пароль.';
        
        toast({
          title: 'Ошибка авторизации',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-50">
      
     
      <div className="hidden md:flex md:w-1/2 bg-[#121c2c] dark:bg-[#0b111b] relative p-12 flex-col justify-center items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#121c2c] via-[#16253b] to-[#1d314f] opacity-80" />
        
        <div className="relative z-10 flex flex-col items-center text-center max-w-md">
          <p className="text-xl md:text-2xl font-medium text-slate-300 mb-6 tracking-wide">
            Welcome to admin panel
          </p>
          
          <img src={logo} className=" object-contain" alt="Logo" />
        </div>
      </div>

     
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 md:p-20">
        <div className="w-full max-w-[400px] space-y-6">
          
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Log in
            </h2>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            
          
            <div className="space-y-1">
              <Input
                id="userName"
                name="userName"
                type="text"
                placeholder="Username"
                className={`h-12 px-4 border-slate-200 focus-visible:ring-blue-600 dark:border-zinc-800 dark:bg-zinc-900 ${
                  formik.touched.userName && formik.errors.userName ? 'border-red-500 focus-visible:ring-red-500' : ''
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.userName}
              />
              {formik.touched.userName && formik.errors.userName ? (
                <p className="text-xs font-medium text-red-500">{formik.errors.userName}</p>
              ) : null}
            </div>

           
            <div className="space-y-1 relative">
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className={`h-12 px-4 pr-11 border-slate-200 focus-visible:ring-blue-600 dark:border-zinc-800 dark:bg-zinc-900 ${
                    formik.touched.password && formik.errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''
                  }`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password ? (
                <p className="text-xs font-medium text-red-500">{formik.errors.password}</p>
              ) : null}
            </div>

           
            <div className="flex justify-center pt-1">
              <a 
                href="#forgot" 
                className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline dark:text-blue-400 transition-all"
              >
                Forgot password?
              </a>
            </div>

           
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-base rounded-md transition-colors shadow-sm mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Logging in...
                </>
              ) : (
                'Log in'
              )}
            </Button> 

          </form>
        </div>
      </div>

    </div>
  );
}