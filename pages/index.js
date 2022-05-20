import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react'
import { Router, useRouter } from 'next/router';
import querystring from 'querystring'
import { generateChallenge } from '../utils/pkce';

const CLIENT_ID = '8887d21cdd694dacb146d301968d58ff';

const CALLBACK_URL = 'http://localhost:3000';
const SPOTIFY_CODE_VERIFIER = "spotify-code-verifier";

export default function Home() {
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
    setCurGuess(0);
    setCurSongs([]);
  }

  const generateGuesses = (curGuessNum) => {
    const tempSongs = []
    const size = Math.min(4, topSongs.length - curGuessNum)
    const answerIdx = getRandomInt(0, size);

    for (let i = 0; i < size; i++) {
      if (i === answerIdx) {
        tempSongs.push(topSongs[curGuessNum])
      }
      else {
        var randomSong;
        do {
          randomSong = topSongs[getRandomInt(curGuessNum + 1, topSongs.length)];
        } while (tempSongs.includes(randomSong))

        tempSongs.push(randomSong)
      }
    }

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

  const getNumber = () => {
    const i = curGuess + 1;
    var phrase = i.toString();
    switch (phrase) {
      case '1':
        phrase += 'st';
        break;
      case '2':
        phrase += 'nd';
        break;
      case '3':
        phrase += 'rd';
        break;
      default:
        phrase += 'th';
        break;
    }
    return phrase;
  }

  useEffect(() => {
    reset();
  }, [topSongs]);

  useEffect(() => {
    if (curSongs.length == 0 && topSongs.length > 0) {
      generateGuesses(curGuess);
    }
  }, [curSongs, topSongs]);

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
        show_dailog: true,
        code_challenge_method: 'S256',
        code_challenge
      });
    void router.push(authenticationUrl);
  }

  const getAccessToken = async () => {
    const code_verifier = window.localStorage.getItem(SPOTIFY_CODE_VERIFIER);

    if (!code_verifier) return;

    const res = await window.fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;',
      },
      body: querystring.stringify({
        client_id: CLIENT_ID,
        grant_type: 'authorization_code',
        redirect_uri: CALLBACK_URL, // this url just needs to match the one used when getting the authorization token
        code: authCode,
        code_verifier,
      })
    });

    const body = await res.json();
    setAccessToken(body.access_token);
    setRefreshToken(body.refresh_token);
  }

  const Duration = {
    SHORT_TERM: 'short_term',
    MEDIUM_TERM: 'medium_term',
    LONG_TERM: 'long_term'
  };
  Object.freeze(Duration);

  const fetchTopSongs = async (duration) => {
    const response = await window.fetch('https://api.spotify.com/v1/me/top/tracks?' +
      querystring.stringify({
        limit: 50,
        offset: 0,
        time_range: duration
      }), {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    });
    const data = await response.json()
    setTopSongs(data.items.map(song => song.name))
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Spotify Stats
        </h1>

        {loggedIn ?
          <>
            <div className={styles.grid}>
              <div className={`${styles.card} ${styles.btn}`} onClick={() => fetchTopSongs(Duration.SHORT_TERM)}>
                <h2>Last 4 Weeks</h2>

              </div>

              <div className={`${styles.card} ${styles.btn}`} onClick={() => fetchTopSongs(Duration.MEDIUM_TERM)}>
                <h2>Last 6 months</h2>
              </div>

              <div className={`${styles.card} ${styles.btn}`} onClick={() => fetchTopSongs(Duration.LONG_TERM)}>
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
            </list>

            {curGuess < topSongs.length &&
              <h1>Choose Your {getNumber()} Top Song</h1>
            }
            <div className={styles.grid}>

              {
                curSongs.map((song, i) =>
                  <div key={song + i} onClick={() => reveal(curSongs[i])} className={`${styles.card} ${styles.btn}`}>
                    <h2>{song}</h2>
                  </div>
                )
              }
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
