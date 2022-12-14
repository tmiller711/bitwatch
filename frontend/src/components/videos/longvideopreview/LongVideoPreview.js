import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import './longvideopreview.css'

const LongVideoPreview = ({ key, video, uploader_info }) => {
    const [thumbnail, setThumbnail] = useState()
    const [title, setTitle] = useState('')
    const [uploader, setUploader] = useState('')
    const [views, setViews] = useState(0)
    const [uploadedAgo, setUploadedAgo] = useState('')
    const [profilePic, setProfilePic] = useState()
    const [link, setLink] = useState('')
    const [channelID, setChannelID] = useState()
    const [description, setDescription] = useState()

    useEffect(() => {
        console.log(uploader_info)
        setThumbnail(video.thumbnail)
        setTitle(video.title)
        setViews(video.views)
        setUploadedAgo(video.uploaded_ago)
        setLink(`/watch?v=${video.video_id}`)
        setChannelID(video.uploader)
        setDescription(video.description)

        setUploader(uploader_info.username)
        setProfilePic(uploader_info.profile_pic)

    }, [video])

    return (
        <div className="long-video-preview">
            <Link to={link} className="video-link">
                <img src={thumbnail} className="thumbnail" />
                <div className="info">
                    <p className="title">{title}</p>
                    <p>{views} views - {uploadedAgo}</p>
                <div className="uploader">
                    <Link to={`/channel?c=${channelID}`} className="channel-link">
                        <img src={profilePic} className="profile-pic" />
                        <p>{uploader}</p>
                    </Link>
                </div>
                <div className='description'>
                    <p>{description}</p>
                </div>
                </div>
            </Link>
        </div>
    )
}

export default LongVideoPreview