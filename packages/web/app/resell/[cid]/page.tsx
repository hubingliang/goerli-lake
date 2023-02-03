'use client';
import queryString from 'query-string';
import axios from '@/lib/axios';
import { useState, useEffect } from 'react';
import NFTMarketplace from '@/abi//NFTMarketplace.json';
import _ from 'lodash';
import { useForm } from 'react-hook-form';
import { useContract, useSigner } from 'wagmi';
import { marketplaceAddress } from '@/config';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';
type FormDataType = {
  name: string;
  description: string;
  price: number;
  imageFile: string;
};

export default function Resell({
  params,
  searchParams,
}: {
  params: { cid: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormDataType>();
  // const getNft = async (tokenUri: string) => {
  //   const meta = await axios.get(tokenUri);
  //   console.log('meta: ', meta);
  //   // updateFormInput((state) => ({ ...state, image: meta.data.image }));
  // };
  const [nft, setNft] = useState<any>(undefined);
  const { data: signer, isError, isLoading } = useSigner();
  const contract = useContract({
    address: marketplaceAddress,
    abi: NFTMarketplace.abi,
    signerOrProvider: signer,
  });
  const fetchAllPinnedFile = async () => {
    const {
      data: { rows: nft },
    } = await axios.get(
      `https://api.pinata.cloud/data/pinList?${queryString.stringify({
        hashContains: params.cid,
      })}`
    );
    setNft(nft.length > 0 && nft[0]);
  };
  async function listNFTForSale(data: FormDataType) {
    // if (!price) return;
    // const web3Modal = new Web3Modal();
    // const connection = await web3Modal.connect();
    // const provider = new ethers.providers.Web3Provider(connection);
    // const signer = provider.getSigner();
    // let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer);
    if (searchParams) {
      const priceFormatted = ethers.utils.parseUnits(`${data.price}`, 'ether');
      if (contract) {
        let listingPrice = await contract.getListingPrice();
        listingPrice = listingPrice.toString();
        let transaction = await contract.resellToken(searchParams.tokenId, priceFormatted, {
          value: listingPrice,
        });
        await transaction.wait();
        router.push('/explore');
      }
    }
  }
  useEffect(() => {
    params.cid && fetchAllPinnedFile();
  }, [params.cid]);
  return (
    <div
      className="container min-h-screen flex justify-around items-center min-w-full"
      style={{ paddingTop: 66 }}
    >
      {nft && (
        <div className="card w-96 bg-base-100 shadow-xl">
          <figure>
            <img src={`https://gateway.pinata.cloud/ipfs/${params.cid}`} alt="" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">{nft.metadata.name}</h2>
            <p>{nft.metadata.keyvalues.description}</p>
            <p>{nft.metadata.keyvalues.price} GoerliETH</p>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit(listNFTForSale)} className="flex flex-col">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Asset Price in Eth</span>
          </label>
          <input
            type="number"
            placeholder="Asset Price in Eth"
            step="0.0001"
            className={`input input-bordered w-full max-w-xs ${errors.price && 'input-error'}`}
            {...register('price', { required: true })}
          />
          <label className="label">
            <span className="label-text-alt"></span>
            {errors.price && (
              <span style={{ color: '#F87272' }} className="label-text-alt">
                This field is required
              </span>
            )}
          </label>
        </div>

        <button type="submit" className="btn">
          List NFT
        </button>
      </form>
    </div>
  );
}
