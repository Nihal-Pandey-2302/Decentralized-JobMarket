// src/components/JobList.js

import React from 'react';
import { ethers } from 'ethers';

const JobList = ({ jobs }) => {
    return (
        <ul className="job-list">
            {jobs.length === 0 ? (
                <p>No jobs available</p>
            ) : (
                jobs.map((job, index) => (
                    <li key={index}>
                        <h3>{job.title}</h3>
                        <p>Description: {job.description}</p>
                        <p>Payment: {ethers.utils.formatEther(job.payment)} ETH</p>
                        <p>Status: {job.isCompleted ? 'Completed' : 'In Progress'}</p>
                        <p>Payment Released: {job.isPaid ? 'Yes' : 'No'}</p>
                    </li>
                ))
            )}
        </ul>
    );
};

export default JobList;
