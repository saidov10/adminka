import { Suspense, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/ui/Header";
import Sidebar from "../components/ui/Sidebar";
import { axiosRequest } from "../utils/token";

interface UserProfile {
  userId: number;
  userName: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  image: string | null;
}

export default function Layout() {
    const [user, setUser] = useState<UserProfile | null>(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axiosRequest.get('api/UserProfile/get-user-profiles');
                const profileData = response.data?.data || response.data;
                const currentProfile = profileData?.userProfiles ? profileData.userProfiles[0] : profileData;
                if (currentProfile) {
                    setUser({
                        userId: currentProfile.userId,
                        userName: currentProfile.userName,
                        firstName: currentProfile.firstName,
                        lastName: currentProfile.lastName,
                        email: currentProfile.email,
                        image: currentProfile.image,
                    });
                }
            } catch (error) {
                console.error("Failed to fetch user profile in Layout:", error);
            }
        };
        fetchUserProfile();
    }, []);

    return (
        <div className="flex flex-col h-screen overflow-hidden text-slate-50 font-sans">
            <Header user={user} />
            <div className="flex flex-1 min-h-0 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-[#f1f5f9] dark:bg-zinc-950 text-slate-900 dark:text-slate-50">
                    <Suspense fallback={
                        <div className="flex items-center justify-center h-full text-slate-400">
                            <div className="flex flex-col items-center gap-3">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
                                <p className="text-xs font-medium">Loading component...</p>
                            </div>
                        </div>
                    }>
                        <Outlet />
                    </Suspense>
                </main>
            </div>
        </div>
    )
}


