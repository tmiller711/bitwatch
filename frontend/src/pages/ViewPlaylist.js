import React, { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import LongVideoPreview from "../components/videos/longvideopreview/LongVideoPreview"
import Spinner from 'react-bootstrap/Spinner'

const ViewPlaylist = ({ showAlert }) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [query, setQuery] = useState(searchParams.get('list'))
    const [videos, setVideos] = useState([])

    // add stuff to get all the videos in the playlist from the backend and display them like youtube
    useEffect(() => {
        const fetchVideos = async () => {
            const res = await fetch(`/api/video/playlist/${query}`)
            if (res.status == 200) {
                const data = await res.json()
            setVideos([...videos, ...data])
            } else if (res.status == 204) {
                showAlert("No videos to show")
            } else {
                showAlert("Error getting playlist videos")
            }

        }

        fetchVideos()
    }, [])

    if (videos.length > 0) {
        return (
            <div className="history">
                <h1>Playlist: {query}</h1>
                {videos.map((video) => (
                    <LongVideoPreview key={video.id} video={video} uploader_info={video.uploader_info} /> 
                ))}
            </div>
        )
    } else {
        return (
            <div className="loading">
                <Spinner animation="border" role="status" className="spinner">

                </Spinner>
            </div>
        )
    }
}

export default ViewPlaylist