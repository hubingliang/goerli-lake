import { ethers } from 'hardhat';
const fs = require('fs');

async function main() {
  const NFTMarketplace = await ethers.getContractFactory('NFTMarketplace');
  const nftMarketplace = await NFTMarketplace.deploy();
  await nftMarketplace.deployed();
  console.log('nftMarketplace deployed to:', nftMarketplace.address);

  fs.writeFileSync(
    '../web/config.ts',
    `export const marketplaceAddress = "${nftMarketplace.address}"
export const JWT = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2OTk4OTBlNi1kMjZmLTQwOGQtODhmYy0xMmQ5OTkwMDQ5ODciLCJlbWFpbCI6ImJyaWFuaHUuY25AZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjFjZDc1NDdlMTcwMzMxN2MwNGU3Iiwic2NvcGVkS2V5U2VjcmV0IjoiMzEzMzlhMDAzY2UzZDhmOWM4ZThmZDQxM2EzYWIwNTc5NjMzOGM2M2Y1NTJmYWY5MTQ1ODdiNGNjZDAzMzM0NCIsImlhdCI6MTY3NTMzMTA2NH0.CpjNoWAdhJHyrZ2gRlPF4C6PWbB9t4cX7tGZPgnz3_8' `
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
