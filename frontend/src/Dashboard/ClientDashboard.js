// src/components/Dashboard/ClientDashboard.js

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import JobList from '../JobList';
import './DashboardStyles.css';

const ClientDashboard = ({ contractAddress, provider }) => {
    const [postedJobs, setPostedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const contract = new ethers.Contract(contractAddress, JobMarketplaceABI.abi, provider);

    const fetchClientJobs = async () => {
        try {
            const signer = provider.getSigner();
            const clientAddress = await signer.getAddress();
            const jobCount = await contract.jobCount();

            const clientJobs = [];
            for (let i = 1; i <= jobCount; i++) {
                const job = await contract.jobs(i);
                if (job.client === clientAddress) {
                    clientJobs.push(job);
                }
            }
            setPostedJobs(clientJobs);
        } catch (error) {
            console.error('Error fetching client jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClientJobs();
    }, []);

    return (
        <div className="dashboard">
            <h2>Client Dashboard</h2>
            {loading ? <p>Loading jobs...</p> : <JobList jobs={postedJobs} />}
        </div>
    );
};

export default ClientDashboard;
