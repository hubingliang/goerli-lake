'use client';
import { NFTList } from '@/components/NFTList';
import { NftTypes } from '@/interface';
import { useState } from 'react';

export default function Profile() {
  const [type, setType] = useState<NftTypes>(NftTypes.OWNED);
  return (
    <div style={{ paddingTop: 66 }} className="p-4 h-full">
      <div className="tabs mb-4">
        <a
          className={`tab tab-bordered ${type === NftTypes.OWNED && 'tab-active'}`}
          onClick={() => setType(NftTypes.OWNED)}
        >
          Owned
        </a>
        <a
          className={`tab tab-bordered ${type === NftTypes.PURCHASED && 'tab-active'}`}
          onClick={() => setType(NftTypes.PURCHASED)}
        >
          Purchased
        </a>
      </div>
      <NFTList type={type}></NFTList>
    </div>
  );
}
