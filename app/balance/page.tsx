"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function BalancePage() {
  const [userAddress, setUserAddress] = useState<string>("");
  const [jwtToken, setJwtToken] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const [fullBalance, setFullBalance] = useState<string>("");
  const [halfBalance, setHalfBalance] = useState<string>("");

  useEffect(() => {
    const updateWalletInfo = () => {
      const storedAddress = localStorage.getItem("walletAddress") || "";
      const storedJwt = localStorage.getItem("jwt") || "";
      setUserAddress(storedAddress);
      setJwtToken(storedJwt);
    };

    updateWalletInfo();
    window.addEventListener("walletChanged", updateWalletInfo);
    return () => {
      window.removeEventListener("walletChanged", updateWalletInfo);
    };
  }, []);

  useEffect(() => {
    if (userAddress && jwtToken) {
      handleCheckBalance();
    }
  }, [userAddress, jwtToken]);

  /** 获取普通余额 */
  const handleCheckBalance = async () => {
    console.log("Fetching balance for address:", userAddress);
    try {
      const response = await axios.get(
        "http://localhost:3333/decrypt/getbalance",
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      );
      setBalance(`${String(response.data)}`);
    } catch (error: any) {
      console.error(
        "Axios error (balance):",
        error.response?.data || error.message
      );
      setBalance("Error fetching balance.");
    }
  };

  /** 全部解密 */
  const handleCheckFullBalance = async () => {
    console.log("Decrypt full balance for address:", userAddress);
    try {
      const response = await axios.post(
        "http://localhost:3333/decrypt/fullydecrypt",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      setFullBalance(`Decrypted Full Balance: ${String(response.data)}`);
    } catch (error: any) {
      console.error(
        "Axios error (full):",
        error.response?.data || error.message
      );
      setFullBalance("Error decrypting tokens (full).");
    }
  };

  /** 部分解密 */
  const handleCheckHalfBalance = async () => {
    console.log("Decrypt half balance for address:", userAddress);
    try {
      const response = await axios.post(
        "http://localhost:3333/decrypt/halfdecrypt",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      setHalfBalance(`Decrypted Half Balance: ${String(response.data)}`);
    } catch (error: any) {
      console.error(
        "Axios error (half):",
        error.response?.data || error.message
      );
      setHalfBalance("Error decrypting tokens (half).");
    }
  };

  return (
    <section className="py-10 sm:py-16 lg:py-6">
      <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 lg:gap-x-24 gap-y-10">
          {/* 左侧 - 余额信息 */}
          <div>
            <h2 className="text-3xl font-bold text-black">CERC20 Balance</h2>
            <p className="mt-2 text-gray-600">
              Check your token balance or decrypt it.
            </p>

            {userAddress && (
              <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
                <p className="text-lg font-semibold text-gray-800">
                  Wallet Address:
                </p>
                <p className="text-sm font-mono text-gray-600">{userAddress}</p>
              </div>
            )}

            {balance && (
              <div className="mt-4 p-4 bg-white rounded-lg shadow-md ">
                <p className="text-lg font-semibold text-gray-800">Balance:</p>
                <p className="text-sm font-mono text-gray-600">{balance}</p>
              </div>
            )}

            {/* 显示解密结果 */}
            {fullBalance && (
              <div className="mt-4 p-4 bg-white rounded-lg shadow-md ">
                <p className="text-lg font-semibold text-gray-800">
                  Full Decrypt Result:
                </p>
                <p className="text-sm font-mono text-gray-600">{fullBalance}</p>
              </div>
            )}

            {halfBalance && (
              <div className="mt-4 p-4 bg-white rounded-lg shadow-md ">
                <p className="text-lg font-semibold text-gray-800">
                  Half Decrypt Result:
                </p>
                <p className="text-sm font-mono text-gray-600">{halfBalance}</p>
              </div>
            )}
          </div>

          {/* 右侧 - 解密按钮和介绍 */}
          <div className="overflow-hidden bg-white rounded-lg shadow-md">
            <div className="p-8 lg:px-12 lg:py-10">
              <h3 className="text-2xl font-semibold text-black">
                Decrypt Balance
              </h3>

              <p className="mt-4 text-lg text-gray-600">
                <strong>Full Decrypt:</strong> When you choose full decrypt, the
                system will reveal your exact token balance. This option fully
                decrypts your encrypted data to display the precise amount of
                tokens you hold.
              </p>

              <button
                onClick={handleCheckFullBalance}
                className="flex items-center justify-center w-full px-4 py-4 mt-4 text-base font-semibold text-black transition-all duration-200 bg-transparent border-2 border-black rounded-md hover:bg-black hover:text-white"
              >
                Check Full Decrypt
              </button>

              <p className="mt-6 text-lg text-gray-600">
                <strong>Half Decrypt:</strong> In contrast, the half decrypt
                option only shows you an approximate range of your token
                balance, ensuring enhanced privacy by not exposing the exact
                figure.
              </p>

              <button
                onClick={handleCheckHalfBalance}
                className="flex items-center justify-center w-full px-4 py-4 mt-4 text-base font-semibold text-black transition-all duration-200 bg-transparent border-2 border-black rounded-md hover:bg-black hover:text-white"
              >
                Check Half Decrypt
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
