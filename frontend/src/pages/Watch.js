import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../css/watch.css";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import VideoInteraction from "../components/VideoInteraction";

const Watch = ({ getCookie, subscribe, unsubscribe }) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [query, setQuery] = useState(searchParams.get('v'))
    const [title, setTitle] = useState('')
    const [video, setVideo] = useState('')
    const [description, setDescription] = useState('')
    const [views, setViews] = useState(0)

    useEffect(() => {
        const getVideo = async () => {
            const video = await fetchVideo()
            
            setTitle(video.title)
            setVideo(video.video)
            setDescription(video.description)
            setViews(video.views)
        }

        getVideo()
    }, [])

    const fetchVideo = async () => {
        const csrftoken = getCookie('csrftoken')

        const res = await fetch('/api/video/get', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                id: query
            })
        })

        const data = await res.json()
        return data
    }


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
        <>
            <div className="video-section">
                {getVideo()} 
                <h3 className="title">{title}</h3>
                {<VideoInteraction fetchVideo={fetchVideo} subscribe={subscribe} unsubscribe={unsubscribe}
                                query={query} getCookie={getCookie} />}
            </div>
            <div className="description-section">
                <p>This is the description</p>
                <p>Views: {views}</p>
            </div>
        </>
    )
}

export default Watch