'use client';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import { useContract, useSigner } from 'wagmi';
import { useState } from 'react';
import NFTMarketplace from '@/abi//NFTMarketplace.json';
import { ChangeEvent } from 'react';
import FormData from 'form-data';
import axios from '@/lib/axios';
import { marketplaceAddress } from '@/config';

type FormDataType = {
  name: string;
  description: string;
  price: number;
  imageFile: string;
};

export default function Mint() {
  const { data: signer, isError, isLoading } = useSigner();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const contract = useContract({
    address: marketplaceAddress,
    abi: NFTMarketplace.abi,
    signerOrProvider: signer,
  });
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormDataType>();

  const onSubmit = (data: FormDataType) => {
    mint(data);
  };

  const mint = async (data: FormDataType) => {
    if (contract) {
      try {
        setLoading(true);
        const cid = await pinFileToIPFS(data);
        // const url = await uploadToIPFS();
        const { price } = getValues();
        const transferPrice = ethers.utils.parseUnits(`${price}`, 'ether');
        let listingPrice = await contract.getListingPrice();
        const transaction = await contract.createToken(cid, transferPrice, { value: listingPrice });
        await transaction.wait();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
        router.push('/explore')
      }
    }
  };
  const pinFileToIPFS = async (data: FormDataType) => {
    const formData = new FormData();
    formData.append('file', data.imageFile[0]);
    const metadata = JSON.stringify({
      name: data.name,
      keyvalues: {
        description: data.description,
        price: data.price,
      },
    });
    formData.append('pinataMetadata', metadata);
    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append('pinataOptions', options);
    try {
      const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        headers: {
          'Content-Type': `multipart/form-data;`,
        },
      });
      return res.data.IpfsHash;
      return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      className="container min-h-screen flex justify-center items-center min-w-full"
      style={{ paddingTop: 66 }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">NFT name</span>
          </label>
          <input
            type="text"
            placeholder="NFT name"
            className={`input input-bordered w-full max-w-xs ${errors.name && 'input-error'}`}
            {...register('name', { required: true })}
          />
          <label className="label">
            <span className="label-text-alt"></span>
            {errors.name && (
              <span style={{ color: '#F87272' }} className="label-text-alt">
                This field is required
              </span>
            )}
          </label>
        </div>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Description your NFT</span>
          </label>
          <textarea
            className={`textarea input-bordered ${errors.description && 'input-error'}`}
            placeholder="NFT description"
            {...register('description', { required: true })}
          ></textarea>
          <label className="label">
            <span className="label-text-alt"></span>
            {errors.description && (
              <span style={{ color: '#F87272' }} className="label-text-alt">
                This field is required
              </span>
            )}
          </label>
        </div>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">NFT price</span>
          </label>
          <input
            type="number"
            placeholder="NFT price"
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

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">NFT image</span>
          </label>
          <input
            type="file"
            className={`file-input input-bordered w-full max-w-xs ${
              errors.imageFile && 'input-error'
            }`}
            {...register('imageFile', { required: true })}
          />
          <label className="label">
            <span className="label-text-alt"></span>
            {errors.imageFile && (
              <span style={{ color: '#F87272' }} className="label-text-alt">
                This field is required
              </span>
            )}
          </label>
        </div>

        <button type="submit" className={`btn ${loading && 'loading'}`}>
          Create NFT
        </button>
      </form>
    </div>
  );
}
