import React, { useEffect, useState } from "react";
import "../css/videopreview.css"
import { Link } from 'react-router-dom';
import Button from "react-bootstrap/Button"
import CloseButton from "react-bootstrap/CloseButton"
import Dropdown from "react-bootstrap/Dropdown"

const VideoPreview = ({ video, edit=false }) => {
    const [thumbnail, setThumbnail] = useState()
    const [title, setTitle] = useState('')
    const [uploader, setUploader] = useState('')
    const [views, setViews] = useState(0)
    const [uploadedAgo, setUploadedAgo] = useState('')
    const [profilePic, setProfilePic] = useState()
    const [link, setLink] = useState('')
    const [channelID, setChannelID] = useState()
    const [yourVideo, setYourVideo] = useState()

    useEffect(() => {
        setThumbnail(video.thumbnail)
        setTitle(video.title)
        setViews(video.views)
        setUploadedAgo(video.uploaded_ago)
        setLink(`/watch?v=${video.video_id}`)
        setChannelID(video.uploader)

        fetchUploader(video.uploader)

    }, [])

    const fetchUploader = async (uploader_id) => {
        const res = await fetch(`/api/account/getuser/${uploader_id}`)
        if (res.ok) {
            const data = await res.json()

            setUploader(data.username)
            setProfilePic(data.profilePic)
        }
    }

    const deleteVideo = async () => {
        console.log("tet")
        const res = await fetch(`/api/video/delete/${video.video_id}`)
        if (!res.ok) {
            alert("Error deleting video")
        }

    }

    return (
        <div className="video-preview">
            <Link to={link} className="video-link">
                <img src={thumbnail} className="thumbnail" />
                <div className="info">
                    <img src={profilePic} className="profile-pic" />
                    <p className="title">{title}</p>
                    {edit == true ? <Button className="delete-vid-button" onClick={() => deleteVideo()}>X</Button> : null}
                </div>
                <div class="uploader">
                    <Link to={`/channel?c=${channelID}`} className="channel-link">
                        <p>{uploader}</p>
                    </Link>
                </div>
                <div className="views">
                    <p>{views} views - {uploadedAgo}</p>
                </div>
            </Link>
        </div>
    )
}

export default VideoPreview