//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract JobMarketplace {
    struct Job {
        uint256 id;
        string title;
        string description;
        uint256 payment; // Amount of Ether for the job
        address payable freelancer;
        address client;
        bool isCompleted;
        bool isPaid;
    }

    uint256 public jobCount;
    mapping(uint256 => Job) public jobs;

    event JobPosted(uint256 jobId, string title, uint256 payment, address client);
    event JobCompleted(uint256 jobId);
    event PaymentReleased(uint256 jobId, address freelancer);

    function postJob(
        string memory _title,
        string memory _description
    ) public payable {
        require(msg.value > 0, "Payment should be in Ether"); // Ensure Ether is sent with the transaction
        
        jobCount++;
        jobs[jobCount] = Job(jobCount, _title, _description, msg.value, payable(address(0)), msg.sender, false, false);

        emit JobPosted(jobCount, _title, msg.value, msg.sender);
    }

    function acceptJob(uint256 _jobId) public {
        Job storage job = jobs[_jobId];
        require(job.client != address(0), "Job does not exist");
        require(job.freelancer == address(0), "Job already taken");

        job.freelancer = payable(msg.sender); // Freelancer accepts the job
    }

    function completeJob(uint256 _jobId) public {
        Job storage job = jobs[_jobId];
        require(msg.sender == job.freelancer, "Only freelancer can complete this job");
        require(!job.isCompleted, "Job already completed");

        job.isCompleted = true;
        emit JobCompleted(_jobId);
    }

    function releasePayment(uint256 _jobId) public {
        Job storage job = jobs[_jobId];
        require(msg.sender == job.client, "Only client can release payment");
        require(job.isCompleted, "Job not completed yet");
        require(!job.isPaid, "Payment already released");

        job.isPaid = true;

        // Transfer Ether to the freelancer
        job.freelancer.transfer(job.payment);

        emit PaymentReleased(_jobId, job.freelancer);
    }

    function searchJobByTitle(string memory _title) public view returns (uint256[] memory) {
        uint256[] memory result = new uint256[](jobCount);
        uint256 count = 0;

        for (uint256 i = 1; i <= jobCount; i++) {
            if (keccak256(abi.encodePacked(jobs[i].title)) == keccak256(abi.encodePacked(_title))) {
                result[count] = i;
                count++;
            }
        }

        // Resize result array to match the number of found jobs
        uint256[] memory finalResult = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            finalResult[i] = result[i];
        }

        return finalResult;
    }
}

