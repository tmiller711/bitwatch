import React, { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useParams } from "react-router-dom"
import VideoPreview from "../components/VideoPreview";
import Spinner from 'react-bootstrap/Spinner'

const Search = ({ getCookie, showAlert }) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [query, setQuery] = useState()
	const [videos, setVideos] = useState()

    useEffect(() => {
        setQuery(searchParams.get('q'))

        const fetchVideos = async () => {
            const csrftoken = getCookie('csrftoken')
            const res = await fetch(`/api/video/getvideos?search=${query}`, {
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
            } else if (res.status == 404) {
                showAlert("No Videos Found")
                setVideos([])
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

    if (videos != undefined) {
        return (
            <>
                <h1>Search: {query}</h1>
                <div className="homepage">
                    {videos != undefined ? mapVideos() : null}
                </div>
            </>
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

export default Search