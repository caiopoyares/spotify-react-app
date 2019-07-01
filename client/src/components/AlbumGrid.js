import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

export default function AlbumGrid({ albums, input }) {
  if (albums[0] === undefined && input !== "") {
    return <p>Desculpe, não encontramos nenhum álbum com esse nome.</p>;
  }
  return (
    <Grid>
      {input && (
        <>
          {albums.map(item => (
            <AlbumBox key={item.id}>
              <StyledLink
                to={`/albums/author=${item.artists[0].name}&id=${item.id}`}
              >
                <div className="img-box">
                  <img src={item.images[1].url} alt={`${item.name}`} />
                </div>
                <h4>{item.name}</h4>
                <p>{item.artists[0].name}</p>
              </StyledLink>
            </AlbumBox>
          ))}
        </>
      )}
    </Grid>
  );
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-gap: 2.75rem 2rem;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const AlbumBox = styled.div`
  margin-left: auto;
  margin-right: auto;
  img {
    margin-bottom: 12px;
    max-width: 90%;
    margin-right: auto;
    margin-left: auto;
    @media (min-width: 800px) {
      max-width: 100%;
    }
  }
  .img-box {
    color: #000;
    &:hover img {
      opacity: 0.5;
    }
  }
  h4 {
    color: #fafafa;
    font-size: 14px;
    line-height: 20px;
    font-weight: normal;
    text-align: center;
    margin-bottom: 5px;
    text-decoration: none;
  }
  p {
    font-size: 14px;
    color: #999;
    text-decoration: none;
    text-align: center;
  }
`;
