'use client';

import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

/** 可选：缩短地址显示，例如 0x1234...abcd */
function shortenAddress(address: string) {
  if (!address) return '';
  return address.slice(0, 6) + '...' + address.slice(-4);
}

export default function Navbar() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  window.dispatchEvent(new Event('walletChanged'));


  useEffect(() => {
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('jwt');
  }, []);

  /** 点击连接按钮时执行连接+签名+登录流程 */
  const handleConnectWallet = async () => {
    if (!window.ethereum) {
      console.error('MetaMask 未安装');
      return;
    }

    try {
      // 1. 请求用户连接钱包，获取地址
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      }) as string[];
      // 强制转换获取的地址为字符串，避免类型不匹配
      const account = String(accounts[0]);
      console.log('Connected account:', account);

      // 2. 请求后端 nonce
      const nonceRes = await axios.post('http://localhost:3333/auth/request-nonce', {
        address: account,
      });
      const nonce = nonceRes.data.nonce;
      console.log('Received nonce:', nonce);

      // 3. 使用钱包对 nonce 进行签名
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [nonce, account],
      });
      console.log('Signature:', signature);

      // 4. 调用登录接口，获取 JWT
      const loginRes = await axios.post('http://localhost:3333/auth/login', {
        address: account,
        signature,
      });
      const loginData = loginRes.data;
      console.log('Login response:', loginData);

      // 5. 登录成功后保存 JWT 和钱包地址到 localStorage，再更新状态
      if (loginData.access_token) {
        localStorage.setItem('jwt', loginData.access_token);
        localStorage.setItem('walletAddress', account);
        window.dispatchEvent(new Event('walletChanged'));
        console.log('JWT and walletAddress 已保存');
        setWalletAddress(account);
      } else {
        console.error('登录失败：', loginData);
        setWalletAddress(null);
      }
    } catch (error) {
      console.error('连接钱包或认证过程出错：', error);
      setWalletAddress(null);
    }
  };

  /** 注销逻辑：移除 localStorage 中的 jwt 和 walletAddress */
  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('walletAddress');
    window.dispatchEvent(new Event('walletChanged'));
    setWalletAddress(null);
    setShowDropdown(false);
  };

  /**
   * 如果未连接，点击按钮执行连接流程；
   * 如果已连接，则仅通过鼠标悬浮控制下拉菜单显示。
   */
  const handleButtonClick = () => {
    if (!walletAddress) {
      handleConnectWallet();
    }
  };

  return (
    <nav className="relative w-full bg-gray-800 text-white shadow-md flex items-center justify-between px-6 py-4">
      {/* 左侧导航 */}
      <div className="flex items-center space-x-6">
        <Link href="/" className="text-xl font-bold">
          SIGHT Confidential ERC20
        </Link>
        <Link href="/faucet" className="hover:underline">
          CERC20 Faucet
        </Link>
        <Link href="/balance" className="hover:underline">
          CERC20 Balance
        </Link>
      </div>

      {/* 右侧按钮和下拉菜单区域 */}
      <div
        className="relative inline-block"
        onMouseEnter={() => walletAddress && setShowDropdown(true)}
        onMouseLeave={() => walletAddress && setShowDropdown(false)}
      >
        <button
          onClick={handleButtonClick}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          {walletAddress ? 'Connected' : 'Connect Wallet'}
        </button>

        {walletAddress && showDropdown && (
          <div className="absolute right-0 top-full w-48 bg-white text-black rounded shadow-lg p-4 z-50">
            <div className="mb-2 text-gray-700">
              <p className="font-semibold">Wallet Address:</p>
              <p>{shortenAddress(walletAddress)}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white w-full py-2 rounded"
            >
              LOG OUT
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
