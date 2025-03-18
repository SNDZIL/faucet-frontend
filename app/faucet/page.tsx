// app/faucet/page.tsx
'use client';

import React, { useState } from 'react';
import axios from 'axios';

export default function FaucetPage() {
  const [userAddress, setUserAddress] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const handleFaucet = async () => {
    console.log('Mint token for address:', userAddress);
    try {
      const response = await axios.post('http://localhost:3333/faucet', {
        address: userAddress,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setResult(`Transaction hash: ${response.data.txHash}`);
    } catch (error: any) {
      console.error('Axios error:', error.response?.data || error.message);
      setResult('Error minting tokens.');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold">CERC20 Faucet</h2>
      <p className="mt-2">Enter your wallet address to mint tokens.</p>
      <input
        type="text"
        placeholder="0x..."
        value={userAddress}
        onChange={(e) => setUserAddress(e.target.value)}
        className="mt-4 border border-gray-300 p-2 rounded w-full max-w-md"
      />
      <button
        onClick={handleFaucet}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Receive Tokens
      </button>
      {result && <p className="mt-4">{result}</p>}
    </div>
  );
}
