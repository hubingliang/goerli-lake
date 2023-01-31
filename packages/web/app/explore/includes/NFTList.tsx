'use client';
import { useContract, useSigner } from 'wagmi';
import { useState, useEffect } from 'react';
import { marketplaceAddress } from '@/config';
import NFTMarketplace from '../../../../contract/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json';
import { ethers } from 'ethers';
import axios from 'axios';
import _ from 'lodash';

interface Nft {
  price: number;
  tokenId: number;
  seller: string;
  owner: string;
  image: string;
  name: string;
  description: string;
}

export const NFTList = () => {
  const { data: signer, isError, isLoading } = useSigner();
  const contract = useContract({
    address: marketplaceAddress,
    abi: NFTMarketplace.abi,
    signerOrProvider: signer,
  });
  const [nftList, setNftList] = useState<Nft[]>([]);
  // const [loadingState, setLoadingState] = useState('not-loaded');
  const loadNFTList = async () => {
    console.log('contract: ', contract);
    if (contract) {
      const data = await contract.fetchMarketItems();
      // const data = await contract.getListingPrice();

      console.log('data: ', data);
      const items = await Promise.all(
        data.map(async (i: any) => {
          const tokenUri = await contract.tokenURI(i.tokenId);
          const tokenId = _.last(tokenUri.split('/'));
          const meta = await axios.get(`https://open-lake.infura-ipfs.io/ipfs/${tokenId}`);
          console.log('meta: ', meta);
          const price = ethers.utils.formatUnits(i.price.toString(), 'ether');
          console.log('price: ', price);
          const item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
            name: meta.data.name,
            description: meta.data.description,
          };
          return item;
        })
      );
      console.log('items: ', items);
      setNftList(items);
      // setLoadingState('loaded');
    }
  };
  useEffect(() => {
    // console.log('signer: ', signer);
    signer && loadNFTList();
  }, [signer]);
  return (
    <div className="grid gap-4 grid-cols-4">
      {nftList.map((nft, i) => {
        return (
          <div className="card bg-base-100 shadow-xl mb-8 flex-1" key={nft.tokenId}>
            <figure>
              <img
                className="mask mask-square w-full object-contain	h-48"
                src={nft.image}
                alt={nft.name}
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{nft.name}</h2>
              {/* <p>{nft.description}</p> */}
              <p>{nft.price} GoerliETH</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Buy Now</button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
