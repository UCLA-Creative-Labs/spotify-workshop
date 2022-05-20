import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react'
import { Router, useRouter } from 'next/router';
import querystring from 'querystring'
import { generateChallenge } from '../utils/pkce';

// const CLIENT_ID = process.env.CLIENT_ID;
// const CLIENT_SECRET = process.env.CLIENT_SECRET;

const CLIENT_ID = '8887d21cdd694dacb146d301968d58ff';
const CLIENT_SECRET = '2e02c630460a4221adc03b494f85e3b0';

const CALLBACK_URL = 'http://localhost:3000';
const SPOTIFY_CODE_VERIFIER = "spotify-code-verifier";

export default function Home(props) {

  const NUMSONGS = 50

  const [loggedIn, setLoggedIn] = useState(false);
  const [authCode, setAuthCode] = useState();
  const [accessToken, setAccessToken] = useState();
  const [revealed, setRevealed] = useState([]);
  const [topSongs, setTopSongs] = useState([]);
  const [curGuess, setCurGuess] = useState(0);
  const [curSongs, setCurSongs] = useState([]);

  const router = useRouter();

  const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min)
  }

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
    const answerIdx = getRandomInt(0, 4);

    for (let i = 0; i < 4; i++) {
      if (i === answerIdx) {
        tempSongs.push(topSongs[curGuessNum])
      }
      else {
        const randomSong = topSongs[getRandomInt(curGuessNum + 1, topSongs.length)];
        tempSongs.push(randomSong)
      }
    }

    console.log(curGuessNum)
    console.log(tempSongs)
    console.log(topSongs[curGuessNum])

    setCurSongs(tempSongs)
  }

  const reveal = (guess) => {
    if (guess === topSongs[curGuess]) {
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

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (!token) {
      setLoggedIn(false);
    } else {
      setLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const code = router.query.code;
    if (!code) return;
    setAuthCode(code);
    console.log("finished setting auth token");
  }, [router]);

  useEffect(() => {
    if (authCode) {
      void getAccessToken();
    }
  }, [authCode]);

  useEffect(() => {
    if (accessToken) setLoggedIn(true);
  }, [accessToken]);

  const login = async () => {
    const { code_challenge, code_verifier } = await generateChallenge();
    window.localStorage.setItem(SPOTIFY_CODE_VERIFIER, code_verifier);
    const authenticationUrl = 'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: 'user-top-read',
        redirect_uri: CALLBACK_URL,
        code_challenge_method: 'SHA256',
        code_challenge
      });
    void router.push(authenticationUrl);
  }

  const getAccessToken = async () => {
    console.log("inside get access token");
    const buffer = new Buffer(`${CLIENT_ID}:${CLIENT_SECRET}`);
    const authHeader = buffer.toString('base64');
    const code_verifier = window.localStorage.getItem(SPOTIFY_CODE_VERIFIER);

    if (!code_verifier) return;
    
    const res = await window.fetch('https://api.spotify.com/v1/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded;',
      },
      body: querystring.stringify({
        client_id: CLIENT_ID,
        grant_type: 'authorization_code',
        redirect_uri: CALLBACK_URL, // this url just needs to match the one used when getting the authorization token
        code: authCode,
        code_verifier,
        client_id: CLIENT_ID
      })
    });

    const body = res.json();
    setAccessToken(body.access_token);
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Spotify Stats
        </h1>

        {loggedIn ?
          <>
            <div>{curGuess}</div>
            <button onClick={initRandomData}>click me too!</button>
            <button onClick={() => generateGuesses(curGuess)}>Generate Guesses</button>

            <div className={styles.grid}>
              <div className={`${styles.card} ${styles.btn}`} onClick={() => { getTopSongs4Weeks(); generateGuesses(); }}>
                <h2>Last 4 Weeks</h2>

              </div>

              <div className={`${styles.card} ${styles.btn}`} onClick={() => { getTopSongs6Months(); generateGuesses(); }}>
                <h2>Last 6 months</h2>
              </div>

              <div className={`${styles.card} ${styles.btn}`} onClick={() => { getTopSongsAllTime(); generateGuesses(); }}>
                <h2>All Time</h2>
              </div>
            </div>
          </> :
          <div className={`${styles.card} ${styles.btn}`} onClick={login}>
            <h2>Login with Spotify</h2>
          </div>
        }

        {/* Display songs */}
        {topSongs.length > 0 &&
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
