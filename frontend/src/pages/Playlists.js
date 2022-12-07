import React, { useEffect, useState } from "react"
import PlaylistPreview from "../components/PlaylistPreview"
import Spinner from 'react-bootstrap/Spinner'

const Playlists = () => {
    const [playlists, setPlaylists] = useState()

    useEffect(() => {
        const fetchPlaylists = async () => {
            const res = await fetch('/api/account/getplaylists')
            const data = await res.json()

            setPlaylists(data)
        }

        fetchPlaylists()
    }, [])

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