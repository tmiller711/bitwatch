import React, { useEffect, useState } from "react"
import PlaylistPreview from "../components/playlistpreview/PlaylistPreview"
import Spinner from 'react-bootstrap/Spinner'

const Playlists = ({ showAlert }) => {
    const [playlists, setPlaylists] = useState()

    useEffect(() => {
        fetchPlaylists()
    }, [])

    const fetchPlaylists = async () => {
        const res = await fetch('/api/account/getplaylists')
        if (res.ok) {
            const data = await res.json()
            setPlaylists(data)
        } else if (res.status == 403) {
            showAlert("Must be signed in to view playlists")
        } else {
            showAlert("Error getting playlists")
        }
    }

    const mapPlaylists = () => {
        return (
        <>
            {playlists.map((playlist) => (
                <PlaylistPreview key={playlist.id} playlist={playlist} />
            ))} 
        </>
        )
    }

    if (playlists != undefined) {
        return (
            <div className="homepage">
                {mapPlaylists()}
            </div>
        )
    } else {
        return (
            <div className="loading">
                <Spinner animation="border" role="status" className="spinner">

                </Spinner>
            </div>
        )
    }
}

export default Playlists