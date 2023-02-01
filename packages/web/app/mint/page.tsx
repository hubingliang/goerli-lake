'use client';
import { useWeb3Modal } from '@web3modal/react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { create } from 'ipfs-http-client';
import { ethers } from 'ethers';
import { useContract, useSigner } from 'wagmi';
import { useState } from 'react';
import NFTMarketplace from '@/abi//NFTMarketplace.json';
import { ChangeEvent } from 'react';
const infuraIpfsprojectId = '2L1l7ttwAeOLGnqZ4ipl2E5Depc';
const infuraIpfsProjectSecret = '276479298f6716853f779dcf04a23ccd';
const auth = `Basic ${Buffer.from(infuraIpfsprojectId + ':' + infuraIpfsProjectSecret).toString(
  'base64'
)}`;
// const client = create({ url: 'https://ipfs.infura.io:5001/api/v0' });
const infuraSubdomainGateway = 'https://open-lake.infura-ipfs.io';
const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

import { marketplaceAddress } from '../../config';

type FormData = {
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
  } = useForm<FormData>();
  const onSubmit = (data: FormData) => {
    console.log(data);
    mint();
  };
  async function uploadToIPFS() {
    const { name, description, price, imageFile } = getValues();
    /* first, upload metadata to IPFS */
    const data = JSON.stringify({
      name,
      description,
      image: imageFile,
    });
    try {
      const added = await client.add(data);
      const url = `${infuraSubdomainGateway}/ipfs/${added.path}`;
      /* after metadata is uploaded to IPFS, return the URL to use it in the transaction */
      console.log('url: ', url);
      return url;
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  }
  const mint = async () => {
    if (contract) {
      setLoading(true);
      const url = await uploadToIPFS();
      const { price } = getValues();
      const transferPrice = ethers.utils.parseUnits(`${price}`, 'ether');
      let listingPrice = await contract.getListingPrice();
      const transaction = await contract.createToken(url, transferPrice, { value: listingPrice });
      await transaction.wait();
      setLoading(false);
      router.push('/explore');
      console.log('listingPrice: ', listingPrice);
    }
  };
  const { onChange } = register('imageFile', { required: true });
  async function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    /* upload image to IPFS */
    console.log('e.target.files: ', e.target.files);
    if (e.target.files) {
      try {
        const file = e.target.files[0];
        const added = await client.add(file, {
          progress: (prog) => console.log(`received: ${prog}`),
        });
        const url = `${infuraSubdomainGateway}/ipfs/${added.path}`;
        setValue('imageFile', url, { shouldValidate: true });
        console.log('url: ', url);
      } catch (error) {
        console.log('Error uploading file: ', error);
      }
    }
  }
  return (
    <div
      className="container min-h-screen flex justify-center items-center min-w-ful"
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
            // {...register('imageFile', { required: true })}
            onChange={(e) => {
              onFileChange(e);
              // onChange(e);
            }}
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

        <input type="submit" className={`btn ${loading && 'loading'}`} />
      </form>
    </div>
  );
}
