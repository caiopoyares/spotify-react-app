import React, { useEffect, useState } from "react";
import queryString from "query-string";
import { connect } from "react-redux";
import styled from "styled-components";
import { millisToMinutesAndSeconds } from "../utils/index";
import { MdPlayCircleOutline, MdPauseCircleOutline } from "react-icons/md";
import { saveRecentlySearch } from "../actions/searchActions";

let player = new Audio(null);

const Album = props => {
  const [album, setAlbum] = useState(null);
  const [currTrack, setCurrTrack] = useState(null);

  useEffect(() => {
    const { id: albumId } = queryString.parse(location.pathname);

    fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
      headers: {
        Authorization: `Bearer ${props.user.access_token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setAlbum(data);
        // Creates an array to keep track of which track is current playing
        const tracks = data.tracks.items.map(() => ({ isPlaying: false }));
        setCurrTrack(tracks);
      })
      .catch(err => console.log(err));
  }, []);

  const playMusic = (track, index) => {
    //set new array to keep track of current playing music
    const NewTracks = [...currTrack];
    const PlayingIndex = NewTracks.findIndex(item => item.isPlaying === true);
    if (PlayingIndex !== -1) {
      NewTracks[PlayingIndex].isPlaying = false;
    }
    NewTracks[index].isPlaying = true;
    setCurrTrack(NewTracks);

    player.src = track;
    player.play();
  };

  const pauseMusic = (track, index) => {
    //set new array to keep track of current playing music
    const NewTracks = [...currTrack];
    NewTracks[index].isPlaying = false;
    setCurrTrack(NewTracks);

    player.pause();
  };

  return (
    album && (
      <FlexContainer>
        <div className="album-meta">
          <div className="img-box">
            <img src={album.images[0].url} alt={`${album.name}`} />
          </div>
          <h4>{album.name}</h4>
          <p>{album.artists[0].name}</p>
        </div>
        <div className="album-info">
          <ul>
            {album.tracks.items.map((track, index) => (
              <StyledList key={track.id}>
                <p className="track-number">{index + 1}.</p>
                <p className="track-name">{track.name}</p>
                {currTrack && (
                  <div>
                    {!currTrack[index].isPlaying ? (
                      <MdPlayCircleOutline
                        onClick={() => playMusic(track.preview_url, index)}
                      />
                    ) : (
                      <MdPauseCircleOutline
                        onClick={() => pauseMusic(track.preview_url, index)}
                      />
                    )}
                  </div>
                )}
                <p className="track-duration">
                  {millisToMinutesAndSeconds(track.duration_ms)}
                </p>
              </StyledList>
            ))}
          </ul>
        </div>
      </FlexContainer>
    )
  );
};

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps)(Album);

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  .album-meta {
    max-width: 350px;
    margin-right: auto;
    margin-left: auto;
    margin-bottom: 2rem;
    h4 {
      margin-top: 1rem;
      font-weight: normal;
      font-size: 18px;
      line-height: 28px;
      text-align: center;
    }
    p {
      color: #999;
      margin-top: 0.5rem;
      font-weight: normal;
      font-size: 14px;
      text-align: center;
    }
  }
  .album-info {
    flex: 1;
    margin-left: 0;
    @media (min-width: 800px) {
      margin-left: 2rem;
    }
  }
  .img-box {
    max-width: 350px;
    margin-right: auto;
    margin-left: auto;
  }
  @media (min-width: 800px) {
    flex-direction: row;
  }
`;

const StyledList = styled.li`
  display: flex;
  align-items: center;
  padding-top: 0.8rem;
  padding-bottom: 0.8rem;
  border-top: 1px solid #262626;
  &:last-child {
    border-bottom: 1px solid #262626;
  }
  .track {
    &-number {
      margin-right: 1.5rem;
    }
    &-number,
    &-duration {
      font-size: 14px;
      color: #999;
    }
    &-name {
      font-size: 14px;
      line-height: 22px;
      flex: 1;
    }
  }
  svg {
    height: 24px;
    width: 24px;
    margin-right: 1rem;
    margin-left: 0.5rem;
    color: #999;
  }
`;
