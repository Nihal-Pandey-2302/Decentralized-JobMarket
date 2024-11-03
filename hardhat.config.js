require("@nomiclabs/hardhat-waffle");

module.exports = {
  defaultNetwork: "amoy",
  networks: {
    amoy: {
      url: "https://rpc-amoy.polygon.technology/",
      accounts: [""]  // Your private key
    }
  },
  solidity: "0.8.0"
};
