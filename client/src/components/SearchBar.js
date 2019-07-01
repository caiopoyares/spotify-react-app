import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { setSearchInput } from "../actions/searchActions";

function SearchBar({ dispatch, searchValue }) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (searchValue !== "") {
      setInputValue(searchValue);
    }
  }, []);

  const handleChange = e => {
    setInputValue(e.target.value);
    dispatch(setSearchInput(e.target.value));
  };

  return (
    <SearchBarContainer>
      <p>Busque por artistas, álbuns ou músicas</p>
      <form>
        <input
          type="text"
          placeholder="Comece a escrever..."
          value={inputValue}
          onChange={handleChange}
        />
      </form>
    </SearchBarContainer>
  );
}

export default connect(state => ({
  searchValue: state.search.currentSearchInput
}))(SearchBar);

const SearchBarContainer = styled.div`
  margin-bottom: 4rem;
  p {
    font-size: 16px;
  }
  input {
    font-size: 32px;
    color: #fafafa;
    font-weight: 700;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    display: block;
    width: 100%;
    background-color: transparent;
    border: none;
    border-bottom: 3px solid #999;
    transition: border-bottom 0.3s;
    @media (min-width: 800px) {
      font-size: 48px;
    }
    &:focus {
      outline: none;
      border-bottom: 3px solid #fafafa;
      transition: border-bottom 0.3s;
    }
  }
`;
