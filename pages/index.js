import styles from '../styles/Home.module.css'
import {useState, useEffect} from 'react'
import {useRouter} from 'next/router';
import querystring from 'querystring'
import {generateChallenge} from '../utils/pkce';
import Game from './game';

// TO DO: replace the client id with the client id for your project
const CLIENT_ID = 'REPLACE WITH YOUR CLIENT ID';
const CALLBACK_URL = 'http://localhost:3000';
const SPOTIFY_CODE_VERIFIER = "spotify-code-verifier";
const Duration = {
  SHORT_TERM: 'short_term',
  MEDIUM_TERM: 'medium_term',
  LONG_TERM: 'long_term'
};
Object.freeze(Duration);

export default function Home() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [authCode, setAuthCode] = useState();
    const [accessToken, setAccessToken] = useState();
    const [topSongs, setTopSongs] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const token = window.localStorage.getItem("token");
        setLoggedIn(!!token);
    }, []);

    useEffect(() => {
        // retrieve the authorization code from the query params on callback
    }, [router]);

    useEffect(() => {
        if (authCode) void getAccessToken();
    }, [authCode]);

    useEffect(() => {
        if (accessToken) setLoggedIn(true);
    }, [accessToken]);

    const login = async () => {
        const {code_challenge, code_verifier} = await generateChallenge();
        window.localStorage.setItem(SPOTIFY_CODE_VERIFIER, code_verifier);
        const authenticationUrl = 'https://accounts.spotify.com/authorize?' +
            querystring.stringify({
                // TO DO: fill in the query params for the authorize /endpoint
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
               // TO DO: fill in the parameters needed for the body of the POST /api/token request
            })
        });

        const body = await res.json();
        // TO DO: save the access_token from the body
    }

    const fetchTopSongs = async (duration) => {
        const response = await window.fetch('https://api.spotify.com/v1/me/top/tracks?' +
            querystring.stringify({
              // TO DO: fill in the body parameters needed for the /top/tracks endpoint
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
                <h1 className={styles.title}> Spotify Stats </h1>
                  {loggedIn ?
                      <div className={`${styles.grid} ${styles.options}`}>
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
                     :
                      <div className={`${styles.card} ${styles.btn} ${styles.options}`} onClick={login}>
                          <h2>Login with Spotify</h2>
                      </div>
                  }
                  <Game topSongs={topSongs} />
            </main>
      </div>
    )
}
