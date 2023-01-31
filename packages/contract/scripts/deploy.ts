import { ethers } from 'hardhat';
const fs = require('fs');

async function main() {
  const NFTMarketplace = await ethers.getContractFactory('NFTMarketplace');
  const nftMarketplace = await NFTMarketplace.deploy();
  await nftMarketplace.deployed();
  console.log('nftMarketplace deployed to:', nftMarketplace.address);

  fs.writeFileSync(
    '../web/config.ts',
    `export const marketplaceAddress = "${nftMarketplace.address}"`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
