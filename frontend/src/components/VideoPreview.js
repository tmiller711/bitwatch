import React, { useEffect, useState } from "react";
import "../css/videopreview.css"
import { Link } from 'react-router-dom';

const VideoPreview = ({ video }) => {
    const [thumbnail, setThumbnail] = useState()
    const [title, setTitle] = useState('')
    const [uploader, setUploader] = useState('')
    const [views, setViews] = useState(0)
    const [uploadedAgo, setUploadedAgo] = useState('')
    const [profilePic, setProfilePic] = useState()
    const [link, setLink] = useState('')

    useEffect(() => {
        setThumbnail(video.thumbnail)
        setTitle(video.title)
        setViews(video.views)
        setUploadedAgo(video.uploaded_ago)
        setLink(`/watch?v=${video.id}`)

        fetchUploader(video.uploader)

    }, [])

    const fetchUploader = async (id) => {
        const res = await fetch(`/api/account/getuser/${id}`)
        if (res.ok) {
            const data = await res.json()

            setUploader(data.username)
            setProfilePic(data.profilePic)
        }
    }

    return (
        <Link to={link} className="video-link">
            <div className="video-preview">
                <img src={thumbnail} className="thumbnail" />
                <div className="info">
                    <img src={profilePic} className="profile-pic" />
                    <p className="title">{title}</p>
                </div>
                <div class="uploader">
                    <p>{uploader}</p>
                </div>
                <div className="views">
                    <p>{views} views - {uploadedAgo}</p>
                </div>
            </div>
        </Link>
    )
}

export default VideoPreview