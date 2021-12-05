import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import dynamic from 'next/dynamic';

import styles from '../styles/Home.module.css';

export const Tuner = dynamic(() => import('../components/Tuner/Tuner'), {
  ssr: false,
});

const Home = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Guithub: Online guitar tuner.</title>
        <meta
          name="description"
          content="Online instrument tuner for guitar, mandolin, ukulele, banjo and other instruments. Play your favorite songs better when you tune your instrument first."
          canonical="https://guithub.org"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Tuner />
      </main>

      <footer className={styles.footer}>
        <a href="https://mikebifulco.com">
          {"It's"} a choona 🐡 weekend project from Mike Bifulco
        </a>
      </footer>
    </div>
  );
};

export default Home;
