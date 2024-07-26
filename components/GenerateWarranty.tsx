"use client"; // Add this at the top of the file

import React, { useState, useEffect } from 'react';
import { doc, setDoc, collection, updateDoc, getDocs, query, where } from 'firebase/firestore';
import { firebaseFirestore } from '@/libs/firebase/config'; // Ensure this path matches your configuration

interface SendWarrantyProps {
  username: string;
  uid: string;
}

const SendWarranty: React.FC<SendWarrantyProps> = ({ username, uid }) => {
  const [warrantyCode, setWarranty] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const handleWarrantyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWarranty(e.target.value);
  };

  const handleSendWarranty = async () => {
    if (warrantyCode.trim() === '') {
      setStatus('Warranty cannot be empty');
      return;
    }

    try {
      // Check if warrantyCode already exists
      const q = query(
        collection(firebaseFirestore, 'warranty'),
        where('warrantyCode', '==', warrantyCode)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        setStatus('Warranty code already exists');
        return;
      }

      const warrantyRef = doc(collection(firebaseFirestore, 'warranty'));

      // Set expiration time to 1 year for testing
      const expirationTime = new Date();
      expirationTime.setFullYear(expirationTime.getFullYear() + 1);

      await setDoc(warrantyRef, {
        warrantyCode,
        timestamp: new Date(),
        expiration: expirationTime,
        status: "available",
        claimed: false,
      });

      setWarranty('');
      setStatus('Warranty sent successfully');
    } catch (error) {
      console.error('Error sending warranty', error);
      setStatus('Warranty sending failed');
    }
  };

  const checkExpiredWarranties = async () => {
    const now = new Date();
    try {
      const q = query(
        collection(firebaseFirestore, 'warranty'),
        where('expiration', '<=', now),
        where('status', '==', 'available')
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log('No warranties to update.');
        return;
      }

      snapshot.forEach(async (doc) => {
        await updateDoc(doc.ref, { status: 'expired' });
      });

      console.log('Warranties updated successfully.');
    } catch (error) {
      console.error('Error updating warranties', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      checkExpiredWarranties();
    }, 60000); // Check every 1 minute

    return () => clearInterval(interval);
  }, []);

  return (
    <main>
      <div>
        <input
          type="text"
          value={warrantyCode}
          onChange={handleWarrantyChange}
          placeholder="Create warranty id"
          className="p-2 border border-gray-300 text-black rounded"
        />
        <button
          onClick={handleSendWarranty}
          className="ml-2 p-2 bg-blue-500 text-white rounded">
          Send
        </button>
        {status && <p className="mt-2">{status}</p>}
      </div>
    </main>
  );
};

export default SendWarranty;
