import React, { useEffect, useContext, useState } from 'react';
import { TokenContext } from '../TokenContext';

const LoginPage = () => {
  const { token, setToken } = useContext(TokenContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hash = window.location.hash;
    let storedToken = window.localStorage.getItem('token');

    if (!storedToken && hash) {
      const tokenParam = hash
        .substring(1)
        .split('&')
        .find((elem) => elem.startsWith('access_token'));

      if (tokenParam) {
        storedToken = tokenParam.split('=')[1];
        window.localStorage.setItem('token', storedToken);
        window.location.hash = ''; // Clear hash from URL
      }
    }

    setToken(storedToken || '');
    console.log('Token set in LoginPage:', storedToken);
    setLoading(false);
  }, [setToken]);

  const logout = () => {
    setToken('');
  };

  if (loading) {
    return <div>Loading...</div>; // Optional loading state
  }

  return (
    <div>
      <h1>Please login to Spotify</h1>
      {!token ? (
        <a
          href={`${process.env.REACT_APP_SPOTIFY_AUTH_ENDPOINT}?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=${process.env.REACT_APP_SPOTIFY_RESPONSE_TYPE}`}
        >
          Login to Spotify
        </a>
      ) : (
        <button onClick={logout}>Logout</button>
      )}
    </div>
  );
};

export default LoginPage;
