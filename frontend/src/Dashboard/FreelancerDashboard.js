// src/components/Dashboard/FreelancerDashboard.js

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import JobList from '../JobList';
import './DashboardStyles.css';

const FreelancerDashboard = ({ contractAddress, provider }) => {
    const [acceptedJobs, setAcceptedJobs] = useState([]);
    const [earnings, setEarnings] = useState(0);
    const [loading, setLoading] = useState(true);

    const contract = new ethers.Contract(contractAddress, JobMarketplaceABI.abi, provider);

    const fetchFreelancerJobs = async () => {
        try {
            const signer = provider.getSigner();
            const freelancerAddress = await signer.getAddress();
            const jobCount = await contract.jobCount();

            const freelancerJobs = [];
            let totalEarnings = ethers.BigNumber.from(0);
            for (let i = 1; i <= jobCount; i++) {
                const job = await contract.jobs(i);
                if (job.freelancer === freelancerAddress) {
                    freelancerJobs.push(job);
                    if (job.isPaid) {
                        totalEarnings = totalEarnings.add(job.payment);
                    }
                }
            }
            setAcceptedJobs(freelancerJobs);
            setEarnings(ethers.utils.formatEther(totalEarnings));
        } catch (error) {
            console.error('Error fetching freelancer jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFreelancerJobs();
    }, []);

    return (
        <div className="dashboard">
            <h2>Freelancer Dashboard</h2>
            <p>Total Earnings: {earnings} ETH</p>
            {loading ? <p>Loading jobs...</p> : <JobList jobs={acceptedJobs} />}
        </div>
    );
};

export default FreelancerDashboard;
