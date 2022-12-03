import React, { useEffect, useState } from "react"
import PlaylistPreview from "../components/PlaylistPreview"

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

    return (
        <div className="playlists">
            {playlists != undefined ? mapPlaylists() : null}
        </div>
    )
}

export default Playlists