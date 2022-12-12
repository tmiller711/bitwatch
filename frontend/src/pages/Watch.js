import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import "../css/watch.css";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner'
import VideoInteraction from "../components/VideoInteraction";
import Comments from "../components/Comments";
import { VideoNotFound } from "../components/NotFound";

const Watch = ({ getCookie, subscribe, unsubscribe, fetchVideoFunction, showAlert }) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [query, setQuery] = useState(searchParams.get('v'))
    const [title, setTitle] = useState('')
    const [video, setVideo] = useState()
    const [description, setDescription] = useState('')
    const [views, setViews] = useState(0)
    const [uploadedAgo, setUploadedAgo] = useState('')
    const [uploaderID, setUploaderID] = useState()
    const [videoNotFound, setVideoNotFound] = useState(false)
    const descriptionRef = useRef(null);

    const [comments, setComments] = useState(null)

    useEffect(() => {
        const fetchVideo = async () => {
            const video = await fetchVideoFunction(query)
            if (video == 404) {
                setVideoNotFound(true)
            } else {
                setUploadedAgo(video.uploaded_ago)
                setTitle(video.title)
                setVideo(video.video)
                setDescription(video.description)
                setViews(video.views)
                setUploaderID(video.uploader)
            }
        }

        fetchVideo()
    }, [])

    useEffect(() => {
        const fetchComments = async () => {
            const res = await fetch(`/api/video/getcomments/${query}/1`)
            const data = await res.json()
            
            setComments(data)
        }

        fetchComments()
    }, [query])
    
    const getVideo = () => {
        return (
            <video className="video-player" controls>
                <source src={video} type="video/mp4" />
                {/* <source src="movie.ogg" type="video/ogg" /> */}
                Your browser does not support the video tag.
            </video>
        )
    }

    const changeDescriptionClass = () => {
        descriptionRef.current.classList.toggle('active')
        // const description = document.querySelector('.description-section')
        // description.classList.toggle('active')
    }

   if (video != undefined && comments != null) {
        return (
            <div className="watch">
                <div className="video-section">
                    {getVideo()} 
                    <h3 className="title">{title}</h3>
                    {<VideoInteraction uploaderID={uploaderID} subscribe={subscribe} unsubscribe={unsubscribe}
                                    query={query} getCookie={getCookie} showAlert={showAlert} />}
                </div>
                <div className="description-section" ref={descriptionRef} onClick={changeDescriptionClass}>
                    <p className="views">{views} views - {uploadedAgo}</p>
                    <p>{description}</p>
                </div>
                <Comments videoID={query} getCookie={getCookie} firstComments={comments} showAlert={showAlert} />
            </div>
        )
    } else if (videoNotFound == true) {
        return (
            <VideoNotFound />
        )
    }
    else {
        return (
            <div className="loading">
                <Spinner animation="border" role="status" className="spinner">

                </Spinner>
            </div>
        )
    }
}

export default Watch