import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../css/watch.css";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import VideoInteraction from "../components/VideoInteraction";
import Comments from "../components/Comments";

const Watch = ({ getCookie, subscribe, unsubscribe, fetchVideo }) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [query, setQuery] = useState(searchParams.get('v'))
    const [title, setTitle] = useState('')
    const [video, setVideo] = useState('')
    const [description, setDescription] = useState('')
    const [views, setViews] = useState(0)
    const [uploadedAgo, setUploadedAgo] = useState('')

    useEffect(() => {
        const getVideo = async () => {
            const video = await fetchVideo(query)
            
            console.log(video)
            setUploadedAgo(video.uploaded_ago)
            setTitle(video.title)
            setVideo(video.video)
            setDescription(video.description)
            setViews(video.views)
        }

        getVideo()
    }, [])

    const getVideo = () => {
        if (video != "") {
            return (
            <video className="video-player" controls>
                <source src={video} type="video/mp4" />
                {/* <source src="movie.ogg" type="video/ogg" /> */}
                Your browser does not support the video tag.
            </video>
        )
        }
    }

    return (
        <div className="watch">
            <div className="video-section">
                {getVideo()} 
                <h3 className="title">{title}</h3>
                {<VideoInteraction fetchVideo={fetchVideo} subscribe={subscribe} unsubscribe={unsubscribe}
                                query={query} getCookie={getCookie} />}
            </div>
            <div className="description-section">
                <p className="views">{views} views - {uploadedAgo}</p>
                <p>{description}</p>
            </div>
            <Comments videoID={query} getCookie={getCookie} />
        </div>
    )
}

export default Watch