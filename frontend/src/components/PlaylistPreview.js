import React, { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import "../css/playlistpreview.css"

const PlaylistPreview = ({ id, playlist }) => {
    
    return (
        <div className="playlist-preview">
            <Link to={`/playlist?list=${playlist.id}`} className="playlist-link">
                <img className="thumbnail"/>
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