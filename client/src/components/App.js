import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { setUser } from "../actions/userActions";
import queryString from "query-string";
import styled from "styled-components";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import logo from "../img/spotify-logo.png";

import { setNewToken } from "../actions/userActions";

import SearchBar from "./SearchBar";
import AlbumGrid from "./AlbumGrid";
import Album from "./Album";

function App({ user, dispatch, input }) {
  const [isExpired, setIsExpired] = useState(false);
  const [albums, setAlbums] = useState([]);

  //when redirect from spotify login, save the token on Redux
  useEffect(() => {
    const response = queryString.parse(location.search);
    if (response.access_token) {
      dispatch(setUser(queryString.parse(location.search)));
    }
  }, []);

  // every time the input value changes, this effect is triggered
  useEffect(() => {
    if (input !== "") {
      const fetchData = async () => {
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=${input}&type=album`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`
            }
          }
        );
        const data = await response.json();
        data.error ? setIsExpired(true) : setAlbums(data.albums.items);
      };
      fetchData();
    }
  }, [input]);

  //Fetch server and get a new access token based on the refresh token
  const handleRefresh = () => {
    fetch(`http://localhost:4000/refresh_token/${user.refresh_token}`)
      .then(data => data.json())
      .then(data => dispatch(setNewToken(data.access_token)))
      .then(() => setIsExpired(false))
      .catch(err => console.log(err));
  };

  if (!user.access_token || window.location.search === "") {
    return (
      <LoginContainer>
        <p>Bem-vindo, é necessário acessar sua conta Spotify para continuar</p>
        <p className="side-note">
          Não se preocupe, ninguém terá acesso às suas informações.
        </p>
        <a href={`http://localhost:4000/login`}>Acessar minha conta</a>
      </LoginContainer>
    );
  }

  if (isExpired) {
    return (
      <LoginContainer>
        <p>Sua sessão expirou. Clique no botão abaixo para entrar novamente.</p>
        <RefreshBtn onClick={handleRefresh}>Entrar novamente</RefreshBtn>
      </LoginContainer>
    );
  }

  return (
    <Router>
      <div className="App">
        <Logo src={logo} alt="Spotify logo" />
        <MainContainer>
          <Switch>
            <Route path="/albums/:album" component={Album} />
            <Route
              render={() => (
                <>
                  <SearchBar />
                  {input !== "" && <AlbumGrid albums={albums} input={input} />}
                </>
              )}
            />
          </Switch>
        </MainContainer>
      </div>
    </Router>
  );
}

const mapStateToProps = state => {
  return {
    user: state.user,
    input: state.search.currentSearchInput
  };
};

export default connect(mapStateToProps)(App);

const LoginContainer = styled.div`
  margin-top: 3rem;
  text-align: center;
  a {
    display: inline-block;
    padding: 1rem 1.5rem;
    font-size: 0.8rem;
    letter-spacing: 1px;
    text-transform: uppercase;
    background-color: #1db954;
    color: #fafafa;
    text-decoration: none;
    border-radius: 200px;
    border: none;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  .side-note {
    color: #999;
    font-size: 14px;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
  }
`;

const MainContainer = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  @media (min-width: 1000px) {
    width: 80%;
    margin-right: auto;
    margin-left: auto;
  }
`;

const Logo = styled.img`
  width: 40px;
  height: 40px;
  margin-top: 1rem;
  margin-left: 1rem;
  @media (min-width: 1000px) {
    margin-left: 3rem;
    width: 50px;
    height: 50px;
  }
`;

const RefreshBtn = styled.button`
  display: inline-block;
  cursor: pointer;
  padding: 1rem 1.5rem;
  background-color: #1db954;
  font-size: 0.8rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #fafafa;
  text-decoration: none;
  border-radius: 200px;
  border: none;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;
