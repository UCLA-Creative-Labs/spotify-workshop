import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {useState, useEffect} from 'react'

export default function Home() {
  const [revealed, setRevealed] = useState([]);
  const [topSongs, setTopSongs] = useState([]);
  const [curGuess, setCurGuess] = useState(0);

  const reset = () => {
    setRevealed([]);
    setTopSongs([]);
    setCurGuess(0);
  }

  const initRandomData = () => {
    const randomData = ['blah', 'trevrawr'];
    const newRevealed = [];
    const newTopSongs = [];

    randomData.forEach(item => {
        newRevealed.push(false);
        newTopSongs.push(item);
      }
    )
    setRevealed(newRevealed);
    setTopSongs(newTopSongs);
  }

  const generateGuesses = () => {
    const answer = topSongs[curGuess];

    

  }

  const reveal = () => {
    const newRevealed = [...revealed]
    newRevealed[curGuess] = true;

    setRevealed(newRevealed);
    setCurGuess(curGuess + 1);
  }

  const showTopSongs = topSongs.map((song, idx) => 
    revealed[idx] ? <li key={idx}>{song}</li> : <li key={idx}>???</li>
  );

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Spotify Stats
        </h1>

        <div>{curGuess}</div>
        <button onClick={() => setCurGuess(curGuess+1)}>click me</button>

        <button onClick={initRandomData}>click me too!</button>

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
        </div>

        <div className={styles.grid}>

          <div onClick={reveal} className={`${styles.card} ${styles.btn}`}>
            <h2>Guess</h2>
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
