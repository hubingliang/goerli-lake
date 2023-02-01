export interface Nft {
  price: number;
  tokenId: number;
  tokenUri: string;
  seller: string;
  owner: string;
  image: string;
  name: string;
  description: string;
}
export enum NftTypes {
  ALL = 'ALL',
  OWNED = 'OWNED',
  PURCHASED = 'PURCHASED',
}
