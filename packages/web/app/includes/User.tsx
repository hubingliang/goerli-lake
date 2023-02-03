'use client';
import { useEnsAvatar } from 'wagmi';
import { useWeb3Modal } from '@web3modal/react';
import { useSigner, useAccount, useEnsName } from 'wagmi';
import { disconnect } from '@wagmi/core';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export const User = () => {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const [initialRenderComplete, setInitialRenderComplete] = useState(false);
  useEffect(() => {
    setInitialRenderComplete(true);
  }, []);
  if (!initialRenderComplete) {
    return null;
  }
  if (isConnected) {
    return (
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
          <div className="w-10">
            {isConnected && <img src={`https://robohash.org/${address}?set=set4`} />}
          </div>
        </label>
        <ul
          tabIndex={0}
          className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <Link href="/profile" className="justify-between">
              Profile
              <span className="badge">New</span>
            </Link>
          </li>
          {/* <li>
            <Link href="/" className="justify-between">
              Settings
            </Link>
          </li> */}
          <li>
            <a onClick={disconnect}>Logout</a>
          </li>
        </ul>
      </div>
    );
  } else {
    return (
      <button
        className="btn btn-sm"
        onClick={() => {
          open();
        }}
      >
        Connect
      </button>
    );
  }
};
