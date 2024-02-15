const { sumTokens2 } = require("../helper/unwrapLPs");

const startBlock = 122567174;

const factoryAddress = "0x10459d450917d93078c8f753e13c80d60ab7006c";

const allowedTokensABI =
  "function getAllowedGlobalTokens() external view returns (address[] memory)";
const userVaultABI =
  "function usersVaultsArray(uint256) external view returns (address)";
const traderWalletABI =
  "function traderWalletsArray(uint256) external view returns (address)";
const numberUVABI =
  "function numOfUsersVaults() external view returns (uint256)";

async function tvl(_, _b, _cb, { api }) {
  const allowedTokens = await api.call({
    abi: allowedTokensABI,
    target: factoryAddress,
  });

  const numberUserVault = await api.call({
    abi: numberUVABI,
    target: factoryAddress,
  });

  const arrNumberUserVaultsParam = [];
  for (let i = 0; i < numberUserVault; i++) {
    arrNumberUserVaultsParam.push({ params: i });
  }

  const userVaults = await api.multiCall({
    abi: userVaultABI,
    target: factoryAddress,
    calls: arrNumberUserVaultsParam,
  });

  const traderWallets = await api.multiCall({
    abi: traderWalletABI,
    target: factoryAddress,
    calls: arrNumberUserVaultsParam,
  });

  return sumTokens2({
    api,
    owners: [...userVaults, ...traderWallets],
    tokens: allowedTokens,
    resolveLP: true,
  });
}

module.exports = {
  methodology: "",
  misrepresentedTokens: true,
  arbitrum: {
    tvl,
  },
  start: startBlock,
};
