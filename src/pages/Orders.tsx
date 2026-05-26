import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Trash2,
  Edit3
} from 'lucide-react';
import type { RootState, AppDispatch } from '../store/store';
import type { UserProfile } from '../reducer/userSlice';

import { fetchUserProfiles } from '../reducer/userSlice';

export default function UsersPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { users, totalRecords, loading } = useSelector((state: RootState) => state.users);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchUserProfiles());
  }, [dispatch]);

  const filteredUsers = users.filter((user: UserProfile) => {
    const fullName = `${user.firstName || ''} ${user.lastName || ''} ${user.userName || ''}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [filteredUsers.length, totalPages, currentPage]);

  const handleSelectUser = (userId: number) => {
    setSelectedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    )
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === currentItems.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentItems.map(u => u.userId));
    }
  };

  const getInitials = (user: UserProfile) => {
    if (user.firstName) return user.firstName[0].toUpperCase();
    return user.userName[0].toUpperCase();
  };

  return (
    <div className="w-full min-h-screen bg-white dark:bg-zinc-950 p-4 md:p-8 text-black dark:text-white font-sans transition-colors duration-200">

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <button className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2.5 rounded-[4px] font-medium text-sm transition-colors shadow-sm">
          <UserPlus size={16} />
          <span>Add user</span>
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
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-zinc-800 bg-transparent rounded-[4px] text-sm focus:outline-none focus:border-[#2563EB] dark:focus:border-blue-500 transition-colors placeholder-gray-400 dark:placeholder-neutral-500"
            />
          </div>

          <div className="relative">
            <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-[4px] text-sm cursor-pointer select-none">
              <span className="text-gray-400 text-xs font-normal absolute -top-2 left-2 bg-white dark:bg-zinc-950 px-1">Filter</span>
              <span className="font-medium">Newest</span>
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>
        </div>

        {selectedUsers.length > 0 && (
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button className="p-2 border border-gray-200 dark:border-zinc-800 rounded-[4px] text-gray-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors">
              <Edit3 size={18} />
            </button>
            <button className="p-2 border border-gray-200 dark:border-zinc-800 rounded-[4px] text-gray-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors">
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
                  checked={currentItems.length > 0 && selectedUsers.length === currentItems.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-gray-300 dark:border-zinc-700 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                />
              </th>
              <th className="py-3.5 px-4 font-normal">User</th>
              <th className="py-3.5 px-4 font-normal">Username</th>
              <th className="py-3.5 px-4 font-normal">Email</th>
              <th className="py-3.5 px-4 font-normal">Roles</th>
              <th className="py-3.5 px-4 font-normal">Date of birth</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-zinc-900 text-sm font-normal text-zinc-700 dark:text-zinc-300">
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="py-4 px-4"><div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-4"></div></td>
                  <td className="py-4 px-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-zinc-800"></div>
                    <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-28"></div>
                  </td>
                  <td className="py-4 px-4"><div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-24"></div></td>
                  <td className="py-4 px-4"><div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-40"></div></td>
                  <td className="py-4 px-4"><div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-16"></div></td>
                  <td className="py-4 px-4"><div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-24"></div></td>
                </tr>
              ))
            ) : currentItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-400 dark:text-zinc-500">
                  No users found.
                </td>
              </tr>
            ) : (
              currentItems.map((user) => {
                const isChecked = selectedUsers.includes(user.userId);
                const hasAvatar = user.image && user.image.trim() !== '';

                return (
                  <tr
                    key={user.userId}
                    className={`hover:bg-gray-50/50 dark:hover:bg-zinc-900/40 transition-colors ${isChecked ? 'bg-blue-50/30 dark:bg-blue-950/10' : ''
                      }`}
                  >
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleSelectUser(user.userId)}
                        className="w-4 h-4 rounded border-gray-300 dark:border-zinc-700 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                      />
                    </td>

                    <td className="py-3.5 px-4 font-medium text-black dark:text-zinc-100">
                      <div className="flex items-center gap-3">
                        {hasAvatar ? (
                          <img
                            src={user.image!}
                            alt={user.userName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold">
                            {getInitials(user)}
                          </div>
                        )}
                        <span>
                          {user.firstName || user.lastName
                            ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                            : 'No Name Specified'}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-zinc-500 dark:text-zinc-400">
                      {user.userName}
                    </td>

                    <td className="py-3.5 px-4 text-zinc-500 dark:text-zinc-400">
                      {user.email}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {user.userRoles && user.userRoles.length > 0 ? (
                          user.userRoles.map((role) => (
                            <span
                              key={role.id}
                              className="bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 text-[11px] font-medium px-2 py-0.5 rounded-[4px]"
                            >
                              {role.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400 dark:text-zinc-600">No Role</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-zinc-500 dark:text-zinc-400">
                      {user.dob ? new Date(user.dob).toLocaleDateString() : '—'}
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
                className={`w-8 h-8 flex items-center justify-center rounded-[4px] text-sm font-medium transition-colors ${currentPage === pageNum
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
            disabled={currentPage === totalPages || filteredUsers.length === 0}
            className="p-2 border border-gray-200 dark:border-zinc-800 rounded-[4px] hover:bg-gray-50 dark:hover:bg-zinc-900 text-gray-500 dark:text-zinc-400 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="text-sm font-medium text-gray-500 dark:text-zinc-400">
          {searchQuery ? filteredUsers.length : totalRecords} Results
        </div>
      </div>

    </div>
  );
}