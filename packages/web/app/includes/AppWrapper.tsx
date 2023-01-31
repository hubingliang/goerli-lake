'use client';
import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum';

import { Web3Modal } from '@web3modal/react';

import { configureChains, createClient, WagmiConfig } from 'wagmi';

import { arbitrum, mainnet, polygon, goerli } from 'wagmi/chains';

export const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  // const chains = [arbitrum, mainnet, polygon, goerli];
  const chains = [goerli];

  // Wagmi client
  const { provider } = configureChains(chains, [
    walletConnectProvider({ projectId: '7614215e1da4508d23418397790ac3b0' }),
  ]);
  const wagmiClient = createClient({
    autoConnect: true,
    connectors: modalConnectors({ appName: 'nft-marketplace', chains }),
    provider,
  });

  // Web3Modal Ethereum Client
  const ethereumClient = new EthereumClient(wagmiClient, chains);
  return (
    <>
      <WagmiConfig client={wagmiClient}>{children}</WagmiConfig>

      <Web3Modal projectId="7614215e1da4508d23418397790ac3b0" ethereumClient={ethereumClient} />
    </>
  );
};
