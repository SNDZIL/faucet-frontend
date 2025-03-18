'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function BalancePage() {
  const [userAddress, setUserAddress] = useState<string>('');
  const [jwtToken, setJwtToken] = useState<string>('');
  const [fullBalance, setFullBalance] = useState<string>('');
  const [halfBalance, setHalfBalance] = useState<string>('');

  // 组件挂载时初始化状态，并监听自定义事件实时更新状态
  useEffect(() => {
    const updateWalletInfo = () => {
      const storedAddress = localStorage.getItem('walletAddress') || '';
      const storedJwt = localStorage.getItem('jwt') || '';
      setUserAddress(storedAddress);
      setJwtToken(storedJwt);
    };

    updateWalletInfo();
    window.addEventListener('walletChanged', updateWalletInfo);
    return () => {
      window.removeEventListener('walletChanged', updateWalletInfo);
    };
  }, []);

  const handleCheckFullBalance = async () => {
    console.log('Decrypt full balance for address:', userAddress);
    try {
      const response = await axios.post(
        'http://localhost:3333/decrypt/fullydecrypt',
        { address: userAddress },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
          },
        }
      );
      setFullBalance(`Decrypted Full Balance: ${String(response.data)}`);
    } catch (error: any) {
      console.error('Axios error (full):', error.response?.data || error.message);
      setFullBalance('Error decrypting tokens (full).');
    }
  };

  const handleCheckHalfBalance = async () => {
    console.log('Decrypt half balance for address:', userAddress);
    try {
      const response = await axios.post(
        'http://localhost:3333/decrypt/halfdecrypt',
        { address: userAddress },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
          },
        }
      );
      setHalfBalance(`Decrypted Half Balance: ${String(response.data)}`);
    } catch (error: any) {
      console.error('Axios error (half):', error.response?.data || error.message);
      setHalfBalance('Error decrypting tokens (half).');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold">CERC20 Balance</h2>
      <p className="mt-2">Check your token balance or decrypt it.</p>
      {userAddress && (
        <p className="mt-2">
          Wallet Address: <span className="font-mono">{userAddress}</span>
        </p>
      )}
      <div className="mt-4 flex space-x-4">
        <button
          onClick={handleCheckFullBalance}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Check Full Decrypt
        </button>
        <button
          onClick={handleCheckHalfBalance}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
        >
          Check Half Decrypt
        </button>
      </div>
      {fullBalance && <p className="mt-4">{fullBalance}</p>}
      {halfBalance && <p className="mt-4">{halfBalance}</p>}
    </div>
  );
}
