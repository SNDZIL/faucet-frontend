"use client";

import React, { useState } from "react";
import axios from "axios";

export default function FaucetPage() {
  const [userAddress, setUserAddress] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const handleFaucet = async () => {
    console.log("Mint token for address:", userAddress);
    try {
      const response = await axios.post(
        "http://localhost:3333/faucet",
        { address: userAddress },
        { headers: { "Content-Type": "application/json" } }
      );
      setResult(`Transaction hash: ${response.data.txHash}`);
    } catch (error: any) {
      console.error("Axios error:", error.response?.data || error.message);
      setResult("Error minting tokens.");
    }
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 px-6 py-8">
      {/* 左侧 Faucet 区域 */}
      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-3xl font-bold">Confidential ERC20 Faucet</h2>
        <p className="mt-2 text-gray-600">
          Send tokens to your wallet for free.
        </p>

        {/* Select Network */}
        {/* <div className="mt-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Network
          </label>
          <select className="w-full border-gray-300 rounded-lg p-3">
            <option>Ethereum Sepolia</option>
          </select>
        </div> */}

        {/* Input Address */}
        <div className="mt-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Send to
          </label>
          <input
            type="text"
            placeholder="Wallet address"
            value={userAddress}
            onChange={(e) => setUserAddress(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg"
          />
          <p className="mt-1 text-gray-500 text-sm">
            Limit: One request per address per 24 hours.
          </p>
        </div>

        {/* 领取按钮 */}
        <button
          onClick={handleFaucet}
          className="mt-6 w-full text-black transition-all duration-200 bg-transparent border-2 border-black hover:bg-black hover:text-white text-lg font-semibold p-3 rounded-lg"
        >
          Send Tokens
        </button>
        {result && <p className="mt-4 text-green-600">{result}</p>}

        {/* About the Faucet */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold">About the Faucet</h2>
          <ul className="mt-4 list-disc list-inside text-gray-700">
            <li>Each wallet can claim tokens only once every 24 hours.</li>
            <li>
              You will receive a random amount between 50 and 150 tokens,
              generated using the Sight Oracle platform.
            </li>
            <li>
              The exact amount remains confidential until decrypted via the
              CERC20 Balance module.
            </li>
          </ul>
        </section>
      </div>

      {/* 右侧 Frequently Asked Questions */}
      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>

        {/* FAQ 列表 */}
        <div className="mt-6">
          {[
            {
              question: "What is CERC20?",
              answer:
                "CERC20 is a confidential ERC20 token that integrates Fully Homomorphic Encryption (FHE) technology, ensuring that sensitive data remains secure on the blockchain.",
            },
            {
              question: "Which networks are supported?",
              answer:
                "Our platform currently supports several EVM-compatible networks. Please refer to our documentation for the most up-to-date list of supported networks.",
            },
            {
              question: "Which wallets are supported?",
              answer:
                "The faucet is compatible with popular Ethereum wallets such as MetaMask, WalletConnect, and other standard wallet providers.",
            },
          ].map((faq, index) => (
            <div key={index} className="border-b border-gray-200 py-4">
              <button
                className="flex justify-between w-full text-lg font-semibold text-gray-700 hover:text-blue-600"
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                <span>{openFAQ === index ? "−" : "+"}</span>
              </button>
              {openFAQ === index && (
                <p className="mt-2 text-gray-600">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
