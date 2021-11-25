import Button from '@mui/material/Button';
import axios from 'axios';
import React, {useEffect, useState} from 'react'


export default function Spotify() {
    const [token, setToken] = useState('');
    const [playlistData, setPlaylistData] = useState({});
    useEffect(() => {
        const code = new URLSearchParams(window?.location.search).get('code');
        if (code) {
            connectSpotify(code);
        }
        if(token) {
            getSpotifyUserId(token);
        }
      }, [token]);

    const handleSpotify = () => {
        window.location = `https://accounts.spotify.com/authorize?client_id=561d6c474d314908a0843348dd671cf2&response_type=code&redirect_uri=http://localhost:3000/spotifyconnect&scope=user-read-private%20user-top-read%20user-read-email%20playlist-modify-public%20playlist-modify-private`;
    };
    
    
    //to get spotify user ID
    const getSpotifyUserId = async (accessToken) => {
        const config = {
            url: 'https://api.spotify.com/v1/me',
            method: 'get',
            headers: {
                Authorization: "Bearer " + accessToken,
                'Content-Type': 'application/json',
            },
         };
        const res = await axios(config);
        const spotifyId = res.data.id;
        if(spotifyId) {
            createSpotifytopTracksPlaylist(token, spotifyId);
        }
    }

    //to get spotify top tracks
    const getSpotifyTopTracks = async (accessToken) => {
        const config = {
            url: 'https://api.spotify.com/v1/me/top/tracks?limit=10',
            method: 'get',
            headers: {
                Authorization: "Bearer " + accessToken,
                'Content-Type': 'application/json',
            },
        };
        const res = await axios(config);
        return res.data.items;
    }

    //playlist exist or not
    const isPlaylistExist = async (accessToken) => {
        const config = {
            url: 'https://api.spotify.com/v1/me/playlists',
            method: 'get',
            headers: {
                Authorization: "Bearer " + accessToken,
                'Content-Type': 'application/json',
            },
         };
         const res = await axios(config);
         if (res.data.items.length > 0) {
             const playlistId = res.data.items.find(item => item.name === 'tum bhi suno');
             setPlaylistData(playlistId);
             return playlistId ? playlistId.id : null;
         }
    }

    //to get top tracks and create playlist in spotify
    const createSpotifytopTracksPlaylist = async (accessToken, userId) => {
        try {
        let playlistId = await isPlaylistExist(accessToken);
        const topTracks  = await getSpotifyTopTracks(accessToken);
        console.log({topTracks, playlistId} );
        if(!playlistId) {
            const config = {
                url: 'https://api.spotify.com/v1/users/' + userId + '/playlists',
                method: 'post',
                headers: {
                    Authorization: "Bearer " + accessToken,
                    'Content-Type': 'application/json',
                },
                data: {
                    name: 'tum bhi suno',
                    description: 'ye mere top gaane h',
                    public: true,
                },
            };
            const res = await axios(config);
            console.log(res);
            playlistId = res.data.id;
        }
       
        const spotifyTopTracksUri = topTracks.map(track => track.uri);

        console.log(spotifyTopTracksUri.toString());
        const uris = spotifyTopTracksUri.toString().replace(/,/g, '%2C').replace(/:/g, '%3A');
        console.log(uris);
        const config1 = {
            url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${uris}`,
            method: 'post',
            headers: {
                Authorization: "Bearer " + accessToken,
                'Content-Type': 'application/json',
            },
        };
        const res1 = await axios(config1);
         console.log(res1);
     } catch (error) {
        console.log({error});
        }
    
    }

    
    //to get spotify access token
    const connectSpotify = async (code) => {
        try {
            const body ={
                code: code,
                grant_type: "authorization_code",
                redirect_uri: process.env.REACT_APP_REDIRECT_URI,
            };
            const config = {
                url: 'https://accounts.spotify.com/api/token',
                method: 'post',
                headers: {
                    Authorization: "Basic " + Buffer.from( process.env.REACT_APP_CLIENT_ID + ":" + process.env.REACT_APP_CLIENT_SECRET ).toString("base64"),
                    'Content-type': 'application/x-www-form-urlencoded',
                },
                data: new URLSearchParams(body),
             };
    
             const res = await axios(config);
             setToken(res.data.access_token);
            } catch (err) {
            console.log({err});
        }
    }
    
    return (
        <div>
            <br/>
            <br/>
            <Button onClick={handleSpotify} variant="contained" >Connect Spotify</Button>
            <h1>{playlistData.name}</h1>
        </div>
    )
}