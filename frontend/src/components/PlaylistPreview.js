import React, { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import "../css/playlistpreview.css"

const PlaylistPreview = ({ id, playlist }) => {
    
    return (
        <div className="playlist-preview">
            <Link to={`/playlist?list=${playlist.id}`} className="playlist-link">
                <div className="img-container">
                    <img className="thumbnail" src={`/media/${playlist.thumbnail}`} />
                    {console.log(playlist)}
                    <div className="overlay">
                        <p>{playlist.private == true ? "Private" : "Public"}</p>
                    </div>
                </div>
                <p className="name">{playlist.name}</p>
                <p className="user">
                    <Link to={`/channel?c=${playlist.creator}`} className="channel-link">
                        {playlist.username}
                    </Link>
                </p>
                <p className="num-videos">{playlist.videos.length} videos</p>
            </Link>
        </div>
    )
}

export default PlaylistPreview