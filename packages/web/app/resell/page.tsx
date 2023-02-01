'use client';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useState, useEffect } from 'react';
import _ from 'lodash';

export default function Resell() {
  const router = useRouter();
  const { id, tokenUri } = router.query;
  const getNft = async (tokenUri: string) => {
    const meta = await axios.get(tokenUri);
    console.log('meta: ', meta);
    // updateFormInput((state) => ({ ...state, image: meta.data.image }));
  };
  useEffect(() => {
    _.isString(tokenUri) && getNft(tokenUri);
  }, [id]);
  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          // onChange={(e) => updateFormInput({ ...formInput, price: e.target.value })}
        />
        {/* {image && <img className="rounded mt-4" width="350" src={image} />} */}
        <button
          // onClick={listNFTForSale}
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
        >
          List NFT
        </button>
      </div>
    </div>
  );
}
