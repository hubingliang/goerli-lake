'use client';
import { useWeb3Modal } from '@web3modal/react';
import { useForm } from 'react-hook-form';
import { create } from 'ipfs-http-client';
import { useContract, useSigner } from 'wagmi';
// import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json';

const client = create({ url: 'https://ipfs.infura.io:5001/api/v0' });

type FormData = {
  name: string;
  description: string;
  price: number;
  imageFile: string;
};

export default function Mint() {
  const { isOpen, open, close } = useWeb3Modal();
  const { data: signer, isError, isLoading } = useSigner();

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<FormData>();
  const onSubmit = (data: FormData) => console.log(data);
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
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      /* after metadata is uploaded to IPFS, return the URL to use it in the transaction */
      console.log('url: ', url);
      return url;
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  }
  const mint = async () => {
    const url = await uploadToIPFS();
    const contract = useContract({
      address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
      // abi: ensRegistryABI,
      signerOrProvider: signer,
    });
  };
  return (
    <div
      className="container min-h-screen flex justify-center items-center min-w-full bg-slate-50"
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
            <span className="label-text">NFT price</span>
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

        <input type="submit" className="btn" />
        {/* <button className="btn" onClick={mint}>
          Button
        </button> */}
      </form>
    </div>
  );
}
