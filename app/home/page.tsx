"use client";

import React, { useState, useEffect } from 'react';
import IndexMain from "../../components/home/indexMain";
import { onAuthStateChanged } from '@/libs/firebase/auth'; // Adjust path if necessary
import SendWarranty from '@/components/GenerateWarranty';

const HomePage: React.FC = () => {
  

  return (
    <main className='w-full min-h-full bg-white'>
      
      <div>
        <IndexMain />
      </div>
    </main>
  );
};

export default HomePage;
