// App.js
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import JobMarketplace from './JobMarketplace';
import './App.css';

const App = () => {
    const [provider, setProvider] = useState(null);
    const contractAddress = '0xD68322De10c85eD3A0c18fA136cB6b4219b3B901'; // Replace with your actual contract address

    useEffect(() => {
      const initProvider = async () => {
          if (window.ethereum) {
              const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
              setProvider(ethersProvider);
              console.log("Provider initialized:", ethersProvider);
          } else {
              console.error("MetaMask not detected");
          }
      };
      initProvider();
  }, []);
  

    const connectWallet = async () => {
        if (provider) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                console.log("Wallet connected");
            } catch (error) {
                console.error("User rejected wallet connection", error);
            }
        }
    };

    return (
        <div className="app">
            <h1>Job Marketplace</h1>
            <button onClick={connectWallet}>Connect Wallet</button>
            {provider && <JobMarketplace contractAddress={contractAddress} provider={provider} />}
        </div>
    );
};

export default App;
