'use client';
import { useContract, useSigner } from 'wagmi';
import queryString from 'query-string';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { marketplaceAddress } from '@/config';
import NFTMarketplace from '@/abi//NFTMarketplace.json';
import { ethers } from 'ethers';
import axios from '@/lib/axios';
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
  const [pinnedFiles, setPinnedFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchAllPinnedFile = async () => {
    const {
      data: { rows: nftList },
    } = await axios.get(
      `https://api.pinata.cloud/data/pinList?${queryString.stringify({ status: 'pinned' })}`
    );
    setPinnedFiles(nftList);
  };
  const loadNFTList = async () => {
    if (contract && pinnedFiles.length) {
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
      const cidList = await Promise.all(
        await data.map(async (i: any) => {
          const cid: string = await contract.tokenURI(i.tokenId);
          const price = ethers.utils.formatUnits(i.price.toString(), 'ether');
          const { metadata } = _.find(pinnedFiles, ['ipfs_pin_hash', cid]);
          console.log('i.tokenId.toNumber(): ', i.tokenId.toNumber());
          return {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: `https://gateway.pinata.cloud/ipfs/${cid}`,
            name: metadata.name,
            description: metadata.description,
            tokenUri: cid,
          };
        })
      );
      setNftList(cidList);
      setLoading(false);
    }
  };
  function listNFT(nft: Nft) {
    router.push(`/resell/${nft.tokenUri}?tokenId=${nft.tokenId}`);
  }
  useEffect(() => {
    setLoading(true);
    signer && loadNFTList();
  }, [signer, type, pinnedFiles]);
  useEffect(() => {
    fetchAllPinnedFile();
  }, []);
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
              <div className="animate-pulse flex space-x-4" key={index}>
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
