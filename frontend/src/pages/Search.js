import React, { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useParams } from "react-router-dom"
import LongVideoPreview from "../components/videos/longvideopreview/LongVideoPreview";
import Spinner from 'react-bootstrap/Spinner'

const Search = ({ getCookie, showAlert }) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [query, setQuery] = useState()
	const [videos, setVideos] = useState([])
    const [page, setPage] = useState(1)

    useEffect(() => {
        setQuery(searchParams.get('q'))

        const fetchVideos = async () => {
            const csrftoken = getCookie('csrftoken')
            const res = await fetch(`/api/video/search/${searchParams.get('q')}/${page}`)
            if (res.ok) {
                const data = await res.json()
                setVideos([...videos, ...data])
            } else if (res.status == 404) {
                showAlert("No Videos Found")
                setVideos([])
            } else if (res.status == 204) {
                null
            }
        }

        fetchVideos()
    }, [searchParams, query, page])
    
    useEffect(() => {
		window.addEventListener('scroll', handleScroll)

		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	})

    const handleScroll = () => {
		const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
		const body = document.body;
		const html = document.documentElement;
		const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
		const windowBottom = windowHeight + window.pageYOffset;
		if (windowBottom >= docHeight) {
			setPage(page + 1)
		}
	}

	const mapVideos = () => {
		return (
			<>
			
			</>
		)
	}

    if (videos.length > 0) {
        return (
            <div className="history">
                <h1>Search: {query}</h1>
                <div className="videos">
                    {videos.map((video) => (
                        <LongVideoPreview key={video.id} video={video} /> 
                    ))}
                </div>
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

export default Search