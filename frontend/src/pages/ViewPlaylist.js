import React, { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import VideoPreview from "../components/VideoPreview"

const ViewPlaylist = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [query, setQuery] = useState(searchParams.get('list'))
    const [videos, setVideos] = useState()

    // add stuff to get all the videos in the playlist from the backend and display them like youtube
    useEffect(() => {
        const fetchVideos = async () => {
            const res = await fetch(`/api/video/playlist/${query}`)
            const videos = await res.json()

            setVideos(videos)
        }

        fetchVideos()
    }, [])

	const mapVideos = () => {
		return (
			<>
			{videos.map((video) => (
				<VideoPreview key={video.id} video={video} /> 
			))}
			</>
		)
	}

    return (
        <>
        <h1>Playlist: {query}</h1>
        <div className="homepage">
            {videos != undefined ? mapVideos() : null}
        </div>
        </>
    )
}

export default ViewPlaylist