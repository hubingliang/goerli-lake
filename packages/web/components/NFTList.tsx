'use client';
import { useContract, useSigner } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { marketplaceAddress } from '@/config';
import NFTMarketplace from '../../contract/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json';
import { ethers } from 'ethers';
import axios from 'axios';
import _ from 'lodash';
import { Nft, NftTypes } from '@/interface';

export const NFTList = ({ type }: { type?: NftTypes }) => {
  const router = useRouter();
  const { data: signer, isError, isLoading } = useSigner();
  const contract = useContract({
    address: marketplaceAddress,
    abi: NFTMarketplace.abi,
    signerOrProvider: signer,
  });
  const [nftList, setNftList] = useState<Nft[]>([]);
  const [loading, setLoading] = useState(true);
  const loadNFTList = async () => {
    if (contract) {
      let data = [];
      switch (type) {
        case NftTypes.ALL:
          data = await contract.fetchMarketItems();
          break;
        case NftTypes.OWNED:
          data = await contract.fetchItemsListed();
          break;
        case NftTypes.PURCHASED:
          data = await contract.fetchMyNFTs();
          break;
        default:
          break;
      }
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
            tokenUri,
          };
          return item;
        })
      );
      setNftList(items);
      setLoading(false);
    }
  };
  function listNFT(nft: Nft) {
    router.push(`/resell-nft?id=${nft.tokenId}&tokenUri=${nft.tokenUri}`);
  }
  useEffect(() => {
    setLoading(true);
    signer && loadNFTList();
  }, [signer, type]);
  const buyNft = async (nft: Nft) => {
    if (contract) {
      const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
      const transaction = await contract.createMarketSale(nft.tokenId, {
        value: price,
      });
      await transaction.wait();
      loadNFTList();
    }
  };
  return (
    <div className="grid gap-4 grid-cols-5">
      {/* <div className="animate-pulse flex space-x-4">
        <div className="card card-compact bg-base-100 shadow-xl mb-8 flex-1">
          <figure>
            <div className="bg-slate-200 h-64 w-full"></div>
          </figure>
          <div className="card-body">
            <div className="grid grid-cols-3 gap-4">
              <div className="h-4 bg-slate-200 rounded col-span-2"></div>
              <div className="h-4 bg-slate-200 rounded col-span-1"></div>
            </div>
            <div className="h-4 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div> */}
      {loading
        ? new Array(10).fill(111).map((item, index) => {
            return (
              <div className="animate-pulse flex space-x-4">
                <div className="card card-compact bg-base-100 shadow-xl mb-8 flex-1">
                  <figure>
                    <div className="bg-slate-200 h-64 w-full"></div>
                  </figure>
                  <div className="card-body">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-4 bg-slate-200 rounded col-span-2"></div>
                      <div className="h-4 bg-slate-200 rounded col-span-1"></div>
                    </div>
                    <div className="h-4 bg-slate-200 rounded"></div>
                  </div>
                </div>
              </div>
            );
          })
        : nftList.map((nft, i) => {
            return (
              <div
                className="card  card-compact bg-base-100 shadow-xl mb-8 flex-1"
                key={nft.tokenId}
              >
                <figure>
                  <div
                    className="bg-no-repeat bg-cover w-full h-64"
                    style={{ backgroundImage: `url(${nft.image})` }}
                  ></div>
                  {/* 
              <img
                className="mask mask-square w-full object-cover"
                src={nft.image}
                alt={nft.name}
              /> */}
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{nft.name}</h2>
                  {/* <p>{nft.description}</p> */}
                  <p>{nft.price} GoerliETH</p>
                  {type === NftTypes.ALL && (
                    <div className="card-actions justify-end">
                      <button className="btn btn-primary" onClick={() => buyNft(nft)}>
                        Buy Now
                      </button>
                    </div>
                  )}
                  {type === NftTypes.PURCHASED && (
                    <div className="card-actions justify-end">
                      <button className="btn btn-primary" onClick={() => listNFT(nft)}>
                        List
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
    </div>
  );
};
