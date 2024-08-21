import React, { useState, createContext, useEffect } from 'react';
import './App.css';
import { GoldRushProvider } from '@covalenthq/goldrush-kit';
import '@covalenthq/goldrush-kit/styles.css';
import { ethers } from 'ethers';
import { Routes, Route } from "react-router-dom";
import Borrow from './components/Borrow';
import Lend from './components/Lend';
import CreditScore from './components/CreditScore';
import MyBorrows from './components/MyBorrows';
import MyLends from './components/MyLends';
import Error from './components/Error';
import Navbar from './components/Navbar';
import config from './config/Constants.json';
import { ToastContainer } from 'react-toastify';


const apiKey = config.api.covalent;
export const WalletContext = createContext(null);
function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [chainID, setChainID] = useState(null);

  const handleWalletConnect = async () => {
    if (!walletConnected) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const chainID = await provider.getNetwork();
        setChainID(parseInt(chainID.chainId));
        setWalletConnected(true);
        setWalletAddress(address);
      } catch (error) {
        console.error("Wallet connection failed:", error);
      }
    } else {
      setWalletConnected(false);
      setWalletAddress('');
      setChainID(null);
    }
  };

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            const network = await provider.getNetwork();
            setChainID(parseInt(network.chainId));
            setWalletConnected(true);
            setWalletAddress(address);
          }
        } catch (error) {
        }
      }
    };
    connectWalletOnPageLoad();
  }, []);

  const handleWalletDisconnect = async () => {
    setWalletConnected(false);
    setWalletAddress('');
    setChainID(null);
  };


  const connectChainId = 4157;
  return (
    <WalletContext.Provider value={{ walletAddress, setWalletAddress }}>
      <GoldRushProvider apikey={apiKey}>
        <div className="bg-gray-900 text-white min-h-screen">
          <Navbar walletConnected={walletConnected} handleWalletConnect={handleWalletConnect} handleWalletDisconnect={handleWalletDisconnect} walletAddress={walletAddress} />
          {walletConnected && chainID === connectChainId && (
            <Routes>
              <Route path="/" element={<Borrow walletConnected={walletConnected} walletAddress={walletAddress} />} />
              <Route path="/lend" element={<Lend walletConnected={walletConnected} walletAddress={walletAddress} />} />
              <Route path="/credit-score" element={<CreditScore walletConnected={walletConnected} walletAddress={walletAddress} />} />
              <Route path='/my-borrows' element={<MyBorrows walletConnected={walletConnected} walletAddress={walletAddress} />} />
              {/* <Route path='/my-lends' element={<MyLends walletConnected={walletConnected} walletAddress={walletAddress} />} /> */}
              <Route path="*" element={<Error />} />
            </Routes>
          )}
          {
            chainID != connectChainId && (
              <div className="flex justify-center items-center h-screen">
                <p className="text-white text-2xl">Please connect to CrossFi Testnet</p>
              </div>
            )
          }
          {
            !walletConnected && (
              <div className="flex justify-center items-center h-screen">
                <p className="text-white text-2xl">Please connect your wallet to CrossFi Testnet!</p>
              </div>
            )
          }
          <ToastContainer />
        </div>
      </GoldRushProvider>
    </WalletContext.Provider>
  );
}

export default App;