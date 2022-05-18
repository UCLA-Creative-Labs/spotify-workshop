import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {useState, useEffect} from 'react'

export default function Home() {

  const [test, setTest] = useState(0);
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Spotify Stats
        </h1>

        <div>{test}</div>
        <button onClick={() => setTest(test+1)}>click me</button>

        <div className={styles.grid}>
          <div className={`${styles.card} ${styles.btn}`}>
            <h2>Last 4 Weeks</h2>
          </div>

          <div className={`${styles.card} ${styles.btn}`}>
            <h2>Last 6 months</h2>
          </div>

          <div className={`${styles.card} ${styles.btn}`}>
            <h2>All Time</h2>
          </div>

          <div className={`${styles.card} ${styles.btn}`}>
            <h2>Deploy &rarr;</h2>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
