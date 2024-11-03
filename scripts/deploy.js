async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contract with account:", deployer.address);

  const JobMarketplace = await ethers.getContractFactory("JobMarketplace");
  const jobMarketplace = await JobMarketplace.deploy();

  await jobMarketplace.deployed();
  console.log("JobMarketplace deployed to:", jobMarketplace.address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
