import React, { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useParams } from "react-router-dom"
import VideoPreview from "../components/VideoPreview";

const Search = ({ getCookie }) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [query, setQuery] = useState()
	const [videos, setVideos] = useState()

    useEffect(() => {
        setQuery(searchParams.get('q'))

        const fetchVideos = async () => {
            const csrftoken = getCookie('csrftoken')
            const res = await fetch("/api/video/getvideos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrftoken
                },
                body: JSON.stringify({
                    search: query
                })
            })
            if (res.ok) {
                const data = await res.json()
                setVideos(data)
            }
        }

        fetchVideos()
    }, [searchParams, query])

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
            <h1>Search: {query}</h1>
            <div className="homepage">
                {videos != undefined ? mapVideos() : null}
            </div>
        </>
    )
}

export default Search