import styles from '../styles/Home.module.css'
import {useState, useEffect} from 'react'

export default function Home() {

  const NUMSONGS = 50

  const [revealed, setRevealed] = useState([]);
  const [topSongs, setTopSongs] = useState([]);
  const [curGuess, setCurGuess] = useState(0);
  const [curSongs, setCurSongs] = useState([]);

  const getRandomInt = (min, max) => {min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min)}

  const reset = () => {
    setRevealed([]);
    setTopSongs([]);
    setCurGuess(0);
    setCurSongs([]);
  }

  const initRandomData = () => {
    const randomData = ['blah', 'trevrawr', 'minecraft', 'joseph', 'cube', 'hello'];
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

  const getTopSongs4Weeks = async () => {
    const response = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50')
    const data = await response.json()
    setTopSongs(data.items)
  }

  const getTopSongs6Months = async () => {
    const response = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=50')
    const data = await response.json()
    setTopSongs(data.items)
  }

  const getTopSongsAllTime = async () => {
    const response = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50')
    const data = await response.json()
    setTopSongs(data.items)
  }

  const generateGuesses = (curGuessNum) => {
    const tempSongs = []
    const answerIdx = getRandomInt(0,4);
    
    for (let i = 0; i <4; i++){
      if(i === answerIdx){
        tempSongs.push(topSongs[curGuessNum])
      }
      else{
        const randomSong = topSongs[getRandomInt(curGuessNum+1,topSongs.length)];
        tempSongs.push(randomSong)
      }
    }

    console.log(curGuessNum)
    console.log(tempSongs)
    console.log(topSongs[curGuessNum])
    
    setCurSongs(tempSongs)
  }

  const reveal = (guess) => {
    if(guess === topSongs[curGuess]){
      const newRevealed = [...revealed]
      newRevealed[curGuess] = true;
      
      setRevealed(newRevealed);
      setCurGuess(curGuess + 1);
      generateGuesses(curGuess + 1)
    }
    
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
        <button onClick={initRandomData}>click me too!</button>
        <button onClick={() => generateGuesses(curGuess)}>Generate Guesses</button>

        <div className={`${styles.card} ${styles.btn}`}>
          <h2>Login with Spotify</h2>
        </div>

        <div className={styles.grid}>
          <div className={`${styles.card} ${styles.btn}`} onClick={() => {getTopSongs4Weeks(); generateGuesses();} }>
            <h2>Last 4 Weeks</h2>

          </div>

          <div className={`${styles.card} ${styles.btn}`} onClick={() => {getTopSongs6Months(); generateGuesses();} }>
            <h2>Last 6 months</h2>
          </div>

          <div className={`${styles.card} ${styles.btn}`} onClick={() => {getTopSongsAllTime(); generateGuesses();} }>
            <h2>All Time</h2>
          </div>
        </div>
        
        {/* Display songs */}
        { topSongs.length > 0 &&
        <>
        <list>
          {showTopSongs}
          {topSongs}
        </list>

        <h1>Choose Your Next Top Song</h1>
        <div className={styles.grid}>
          
          <div onClick={() => reveal(curSongs[0])} className={`${styles.card} ${styles.btn}`}>
            <h2>{curSongs[0]}</h2>
          </div>

          <div onClick={() => reveal(curSongs[1])} className={`${styles.card} ${styles.btn}`}>
            <h2>{curSongs[1]}</h2>
          </div>

          <div onClick={() => reveal(curSongs[2])} className={`${styles.card} ${styles.btn}`}>
            <h2>{curSongs[2]}</h2>
          </div>

          <div onClick={() => reveal(curSongs[3])} className={`${styles.card} ${styles.btn}`}>
            <h2>{curSongs[3]}</h2>
          </div>
        </div>
        </>
        }
      </main>
    </div>
  )
}
