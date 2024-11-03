import React, { useEffect, useState, useCallback } from 'react'; // Import useCallback
import { ethers } from 'ethers';
import JobMarketplaceABI from './abis/JobMarketplaceABI.json';
import './JobMarketplace.css';

const JobMarketplace = ({ contractAddress, provider }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [payment, setPayment] = useState('');

    const contract = new ethers.Contract(contractAddress, JobMarketplaceABI.abi, provider);

    // Fetch jobs function with useCallback
    const fetchJobs = useCallback(async () => {
        try {
            const count = await contract.jobCount();

            const jobArray = [];
            for (let i = 1; i <= count.toNumber(); i++) {
                const job = await contract.jobs(i);
                jobArray.push(job);
            }
            setJobs(jobArray);
        } catch (error) {
            console.error("Error fetching jobs:", error);
        } finally {
            setLoading(false);
        }
    }, [contract]);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]); // Add fetchJobs to the dependency array

    const acceptJob = async (jobId) => {
        const signer = provider.getSigner();
        const contractWithSigner = contract.connect(signer);
        try {
            const tx = await contractWithSigner.acceptJob(jobId);
            await tx.wait();
            fetchJobs(); 
        } catch (error) {
            console.error("Error accepting job:", error);
        }
    };

    const releasePayment = async (jobId) => {
        const signer = provider.getSigner();
        const contractWithSigner = contract.connect(signer);
        try {
            const tx = await contractWithSigner.releasePayment(jobId);
            await tx.wait();
            fetchJobs(); 
        } catch (error) {
            console.error("Error releasing payment:", error);
        }
    };

    const completeJob = async (jobId) => {
        const signer = provider.getSigner();
        const contractWithSigner = contract.connect(signer);
        try {
            const tx = await contractWithSigner.completeJob(jobId);
            await tx.wait();
            fetchJobs(); 
        } catch (error) {
            console.error("Error completing job:", error);
        }
    };

    const postJob = async (e) => {
        e.preventDefault();
        const signer = provider.getSigner();
        const contractWithSigner = contract.connect(signer);
        try {
            const tx = await contractWithSigner.postJob(title, description, {
                value: ethers.utils.parseEther(payment),
            });
            await tx.wait();
            fetchJobs(); 
        } catch (error) {
            console.error("Error posting job:", error);
        }
    };

    return (
        <div className="job-marketplace">
            <div className="job-container">
                <div className="available-jobs">
                    <h2>Available Jobs</h2>
                    {loading ? (
                        <p>Loading jobs...</p>
                    ) : (
                        <ul>
                            {jobs.length === 0 ? (
                                <p>No jobs available</p>
                            ) : (
                                jobs
                                    .slice()
                                    .reverse()
                                    .map((job, index) => (
                                        <li key={index}>
                                            <h3>{job.title}</h3>
                                            <p>Description: {job.description}</p>
                                            <p>Payment: {ethers.utils.formatEther(job.payment)} ETH</p>
                                            <p>Status: {job.isCompleted ? 'Completed' : 'In Progress'}</p>
                                            <p>Payment Released: {job.isPaid ? 'Yes' : 'No'}</p>

                                            {job.freelancer === ethers.constants.AddressZero && !job.isCompleted && (
                                                <button onClick={() => acceptJob(job.id)}>Accept Job</button>
                                            )}

                                            {job.freelancer !== ethers.constants.AddressZero && !job.isCompleted && (
                                                <button onClick={() => completeJob(job.id)}>Complete Job</button>
                                            )}

                                            {job.isCompleted && !job.isPaid && (
                                                <button onClick={() => releasePayment(job.id)}>Release Payment</button>
                                            )}
                                        </li>
                                    ))
                            )}
                        </ul>
                    )}
                </div>

                <div className="post-job">
                    <h2>Post a Job</h2>
                    <form onSubmit={postJob}>
                        <div>
                            <label>Title:</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Description:</label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Payment (ETH):</label>
                            <input
                                type="number"
                                value={payment}
                                onChange={(e) => setPayment(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit">Post Job</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default JobMarketplace;
