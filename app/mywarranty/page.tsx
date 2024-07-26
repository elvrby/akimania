"use client"; // Ensure this is at the top of the file

import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firebaseFirestore } from '@/libs/firebase/config';
import jsPDF from 'jspdf';
import { onAuthStateChanged } from '@/libs/firebase/auth'; // Import the auth function
import { useRouter } from 'next/navigation'; // Import useRouter for redirection

const MyWarranty: React.FC = () => {
  const [warrantyCode, setWarrantyCode] = useState('');
  const [warranty, setWarranty] = useState<any | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Initialize router

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((authUser) => {
      if (authUser) {
        setLoading(false);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleWarrantyCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWarrantyCode(e.target.value);
  };

  const handleSearchWarranty = async () => {
    if (warrantyCode.trim() === '') {
      setStatus('Warranty code cannot be empty');
      return;
    }

    try {
      const q = query(
        collection(firebaseFirestore, 'warranty'),
        where('warrantyCode', '==', warrantyCode)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setStatus('Warranty not found or you filled incorrectly');
        setWarranty(null);
        return;
      }

      const warrantyData = snapshot.docs[0].data();
      
      if (warrantyData.claimed) {
        setWarranty({ id: snapshot.docs[0].id, ...warrantyData });
        setStatus(null);
      } else {
        setStatus('Warranty not claimed yet. Redirecting to claim warranty...');
        setTimeout(() => {
          router.push('/claimwarranty'); // Redirect to /claimwarranty after a short delay
        }, 2000); // Delay for 2 seconds to show the error message
      }
    } catch (error) {
      console.error('Error fetching warranty', error);
      setStatus('Error fetching warranty');
    }
  };

  const handlePrint = (warranty: any) => {
    const doc = new jsPDF();
    const margin = 10;
    const width = 180; // Width of the card
    const height = 100; // Height of the card

    // Draw card background
    doc.setFillColor(255, 255, 255); // White background
    doc.rect(margin, margin, width, height, 'F');

    // Draw border
    doc.setLineWidth(2);
    doc.setDrawColor(0, 0, 0); // Black border
    doc.rect(margin, margin, width, height);

    // Add header
    doc.setFontSize(18);
    doc.setTextColor(0, 102, 204); // Blue color
    doc.text('Warranty Receipt', margin + 10, margin + 20);

    // Add warranty details
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0); // Black text
    doc.text(`Warranty Code: ${warranty.warrantyCode}`, margin + 10, margin + 35);
    doc.text(`Expiration Date: ${new Date(warranty.expiration.seconds * 1000).toLocaleDateString()}`, margin + 10, margin + 50);

    // Add footer
    doc.setFontSize(12);
    doc.setTextColor(128, 128, 128); // Gray color
    doc.text('Thank you for your purchase!', margin + 10, margin + 80);

    doc.save(`warranty_${warranty.warrantyCode}.pdf`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Warranties</h1>
      <div className="mb-4">
        <input
          type="text"
          value={warrantyCode}
          onChange={handleWarrantyCodeChange}
          placeholder="Enter Warranty Code"
          className="p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleSearchWarranty}
          className="ml-2 p-2 bg-blue-500 text-white rounded">
          Search
        </button>
      </div>
      {status && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4 mx-4 w-auto max-w-4xl mb-5">
          <div className="flex items-start">
            <svg
              className="fill-current h-6 w-6 text-red-500 mr-3"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              aria-labelledby="alert-title"
            >
            </svg>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
              <svg
                className="fill-current h-6 w-6 text-red-500 cursor-pointer"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                onClick={() => setStatus(null)} // Hide the alert when clicking the close icon
              >
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </span>
          </div>
          <div className="mt-2">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline">{status}</span>
          </div>
        </div>
      )}
      {warranty && (
        <div
          key={warranty.id}
          id={`warranty-${warranty.id}`}
          className="border p-4 mb-4 rounded shadow-lg bg-green-100 border-green-400 text-green-700">
          <h2 className="text-xl font-bold mb-2">Warranty Code: {warranty.warrantyCode}</h2>
          <p>Expiration Date: {new Date(warranty.expiration.seconds * 1000).toLocaleDateString()}</p>
          <button
            onClick={() => handlePrint(warranty)}
            className="mt-2 p-2 bg-blue-500 text-white rounded">
            Print Receipt
          </button>
        </div>
      )}
    </div>
  );
};

export default MyWarranty;
