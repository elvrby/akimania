"use client";
import AdminSidebar from "../../components/admin/adminSidebar";
import { useEffect, useState } from 'react';
import Image from "next/image";
import { onAuthStateChanged, getUserRoles } from '@/libs/firebase/auth';
import { User } from 'firebase/auth';
import ClipLoader from 'react-spinners/ClipLoader';

const AdminPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (authUser) => {
      setUser(authUser);
      if (authUser) {
        const roles = await getUserRoles(authUser.uid);
        if (roles === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="text-center">
          <ClipLoader color="white" loading={loading} size={30} /> {/* Loading spinner */}
          <h2 className="text-white mt-4">Tunggu Sebentar....</h2>
        </div>
      </div>
    );
  }

  // Function to handle sidebar toggle
  const handleSidebarToggle = (isOpen: boolean) => {
    setIsSidebarOpen(isOpen);
  };

  return (
    <div className="flex flex-col h-screen">

      {/* Main content and sidebar */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <AdminSidebar onToggle={handleSidebarToggle} />

        {/* Main Content */}
        <main
          className={`flex-1 p-4 bg-gray-300 transition-all duration-300 ${isSidebarOpen ? 'ml-80' : 'ml-16'}`}>
          
          <div className="flex justify-center items-start mt-10">
            <div className="block justify-center items-center">
              <Image className="rounded-full ml-9" src="/Image/Logo-akimania.jpg" alt="Logo Akimania" width={200} height={200} />
              <div className="text-center text-3xl mt-4 font-semibold text-black">
                {user ? <h1>Welcome, {user.displayName}</h1> : <h1>Please sign in.</h1>}
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default AdminPage;
