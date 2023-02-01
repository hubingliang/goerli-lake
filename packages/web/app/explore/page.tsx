import { NftTypes } from '@/interface';
import { NFTList } from '../../components/NFTList';

export default function Explore() {
  return (
    <div style={{ paddingTop: 66 }} className="p-4">
      <NFTList type={NftTypes.ALL}></NFTList>
    </div>
  );
}
