"use client";
import AdminSidebar from "../../../components/admin/adminSidebar";
import Header from "../../../components/header";
import React, {useEffect, useState } from 'react';
import { onAuthStateChanged } from '@/libs/firebase/auth'; // Adjust path if necessary
import SendWarranty from '@/components/GenerateWarranty';

const AddWarrantyPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<{ username: string; uid: string } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser({
          username: authUser.displayName || 'No username',
          uid: authUser.uid,
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

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
          className={`flex-1 p-4 bg-gray-100 transition-all duration-300 ${isSidebarOpen ? 'ml-80' : 'ml-16'}`}
        >
            <div>
          <h1 className='text-black'>Welcome to warranty generator</h1>
          {user ? (
            <SendWarranty username={user.username} uid={user.uid} />
          ) : (
            <p>Please log in to make warranty</p>
          )}
        </div>
        </main>
      </div>
    </div>
  );
};

export default AddWarrantyPage;
