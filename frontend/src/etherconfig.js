import { ethers } from "ethers";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const contractAddress = "0x1efa4133b3868efed6230525f251ac68b76da580";  // Replace with your deployed contract address
const contractABI = [
    // ABI goes here
];

const jobMarketplaceContract = new ethers.Contract(contractAddress, contractABI, signer);

export default jobMarketplaceContract;
