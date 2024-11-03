// src/utils/fetchUserData.js

import { ethers } from 'ethers';

export const fetchUserRole = async (contract, provider) => {
    const signer = provider.getSigner();
    const address = await signer.getAddress();

    const isClient = await contract.isClient(address);
    const isFreelancer = await contract.isFreelancer(address);

    return { isClient, isFreelancer };
};
