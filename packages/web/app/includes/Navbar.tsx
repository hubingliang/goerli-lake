import Link from 'next/link';
import { User } from './User';

export const Navbar = () => {
  return (
    <div className="navbar bg-base-100 fixed top-0 z-10">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost normal-case text-xl">
          Goerli Lake
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/explore">Explore</Link>
          </li>
          <li>
            <Link href="/mint">Mint NFT</Link>
          </li>
          <li tabIndex={0}>
            <a>
              Parent
              <svg
                className="fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
              </svg>
            </a>
            <ul className="p-2 bg-base-100">
              <li>
                <a>Submenu 1</a>
              </li>
              <li>
                <a>Submenu 2</a>
              </li>
            </ul>
          </li>
          <li>
            <a>Item 3</a>
          </li>
        </ul>
      </div>
      <User></User>
    </div>
  );
};
