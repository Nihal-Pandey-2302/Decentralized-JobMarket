require("@nomiclabs/hardhat-waffle");

module.exports = {
  defaultNetwork: "amoy",
  networks: {
    amoy: {
      url: "https://rpc-amoy.polygon.technology/",  // Replace with actual RPC URL of Amoy
      accounts: ["fa52128556ca1f165240fffc68d94dcff3fc9e81ba2e66df1707ba38b216551d"]  // Your private key
    }
  },
  solidity: "0.8.0"
};
