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
        <title>Choona</title>
        <meta name="description" content="Browser-based tuner" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Tuner />
      </main>

      <footer className={styles.footer}>
        <a>{"It's"} a choona 🐡</a>
      </footer>
    </div>
  );
};

export default Home;
