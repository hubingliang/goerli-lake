'use client';
import { useEnsAvatar } from 'wagmi';
import { useWeb3Modal } from '@web3modal/react';

export const User = () => {
  const { isOpen, open, close } = useWeb3Modal();
  // const { data, isError, isLoading } = useEnsAvatar({
  //   address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
  // });
  // console.log('data: ', data);
  // if (data) {
  return <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />;
  // }

  return <></>;
};
