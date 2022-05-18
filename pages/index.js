import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {useState, useEffect} from 'react'

export default function Home() {

  const [topSongs, setTopSongs] = useState([]);
  const [curGuess, setCurGuess] = useState(0);

  const showTopSongs = () => {
    return topSongs.map(song => 
      <li key={song}>{song}</li>  
    )
  }
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Spotify Stats
        </h1>

        <div>{curGuess}</div>
        <button onClick={() => setCurGuess(curGuess+1)}>click me</button>

        <button onClick={() => setTopSongs(['blah','trevrawr'])}>click me too!</button>

        <div className={`${styles.card} ${styles.btn}`}>
          <h2>Login with Spotify</h2>
        </div>

        <list>
          {showTopSongs}
        </list>

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
