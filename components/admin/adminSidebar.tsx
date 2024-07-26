"use client";
import Link from 'next/link';
import React, { useState } from 'react';

const AdminSidebar: React.FC<{ onToggle: (isOpen: boolean) => void }> = ({ onToggle }) => {
    const [isOpen, setIsOpen] = useState(true); // Start with sidebar open

    const toggleSidebar = () => {
        const newState = !isOpen;
        setIsOpen(newState);
        onToggle(newState); // Notify parent about the state change
    };

    return (
        <div className={`fixed top-16 left-0 h-[calc(100vh-64px)] bg-black transition-all duration-300 ${isOpen ? 'w-80' : 'w-16'} overflow-hidden z-30`}>
            <div className="flex flex-col h-full">
                {/* SVG Icon */}
                <div className={`flex items-start justify-center bg-black p-2 transition-transform duration-300 ${isOpen ? 'w-16' : 'w-10'} absolute top-5 right-3 z-40`}>
                    <svg
                        onClick={toggleSidebar}
                        className="cursor-pointer text-white"
                        viewBox="0 0 512 512"
                        width="24"
                        height="24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <title>Menu</title>
                        <g fill='white'>
                            <path d="M441.13,166.52h-372a15,15,0,1,1,0-30h372a15,15,0,0,1,0,30Z" />
                            <path d="M441.13,279.72h-372a15,15,0,1,1,0-30h372a15,15,0,0,1,0,30Z" />
                            <path d="M441.13,392.92h-372a15,15,0,1,1,0-30h372a15,15,0,0,1,0,30Z" />
                        </g>
                    </svg>
                </div>
                {/* Sidebar Links */}
                <div className={`${isOpen ? 'block' : 'hidden'} px-4 pt-8 transition-opacity duration-300`}>
                    <h2 className="text-white text-lg font-semibold mb-4">Admin Menu</h2>
                    <ul className="space-y-2">
                        <li>
                            <Link href="/admin/addWarranty" passHref>
                                <span className="text-white block py-2 px-2 rounded hover:bg-gray-700">Add Warranty</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/warranty">
                                <span className="text-white block py-2 px-2 rounded hover:bg-gray-700">Warranty</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/trashbin">
                                <span className="text-white block py-2 px-2 rounded hover:bg-gray-700">Trash Bin</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;
