import Image from 'next/image';
import { Inter } from '@next/font/google';
import styles from './page.module.css';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <main className={styles.main}>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Goerli Gallery</h1>
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi
              exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.
            </p>
            <p className="py-6">
              You can go to{' '}
              <a className="link" href="https://goerlifaucet.com/">
                goerlifaucet.com
              </a>{' '}
              to get free goerli ETH
            </p>
            <button className="btn btn-primary mr-4">Get Started</button>
            <button className="btn">Get Free Goerli ETH</button>
          </div>
        </div>
      </div>
    </main>
  );
}
