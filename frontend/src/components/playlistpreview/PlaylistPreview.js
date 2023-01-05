import React, { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import Button from "react-bootstrap/Button"
import "./playlistpreview.css"

const PlaylistPreview = ({ id, playlist, getCookie, edit=false, showAlert }) => {

    const deletePlaylist = async () => {
        const csrftoken = getCookie('csrftoken')
        const res = await fetch(`/api/account/deleteplaylist/${playlist.id}`, {
            method: "DELETE",
            headers: {
                'X-CSRFToken': csrftoken
            }
        })
        if (!res.ok) {
            showAlert("Error deleting playlist")
        }
    }
    
    return (
        <div className="playlist-preview">
            <Link to={`/playlist?list=${playlist.id}`} className="playlist-link">
                <div className="img-container">
                    <img className="thumbnail" src={playlist.thumbnail} />
                    <div className="overlay">
                        <p>{playlist.private == true ? "Private" : "Public"}</p>
                    </div>
                </div>
                <div className="playlist-info">
                    <p className="name">{playlist.name}</p>
                    {edit == true ? <Button className="delete-playlist-button" onClick={() => deletePlaylist()}>X</Button> : null}
                    <p className="user">
                        <Link to={`/channel?c=${playlist.creator}`} className="channel-link">
                            {playlist.username}
                        </Link>
                    </p>
                    <p className="num-videos">{playlist.videos.length} videos</p>
                </div>
            </Link>
        </div>
    )
}

export default PlaylistPreview