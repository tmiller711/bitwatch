import React, { useEffect, useState, useRef } from "react"
import { Navigate, useSearchParams, useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"
import LongVideoPreview from "../../components/videos/longvideopreview/LongVideoPreview";
import Spinner from 'react-bootstrap/Spinner'
import { ListGroup } from "react-bootstrap";
import "./search.css"

const Search = ({ getCookie, showAlert }) => {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const [query, setQuery] = useState(searchParams.get('q'))
	const [videos, setVideos] = useState([])
    const [page, setPage] = useState(1)

    useEffect(() => {
        setQuery(searchParams.get('q'))

        const fetchVideos = async () => {
            console.log('1')
            const res = await fetch(`/api/video/search/${searchParams.get('q')}/${searchParams.get('sb') || 'v'}/${page}`)
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
    }, [page])

    useEffect(() => {
        setVideos([])

        const fetchVideos = async () => {
            const res = await fetch(`/api/video/search/${searchParams.get('q')}/${searchParams.get('sb') || 'v'}/1`)
            if (res.ok) {
                const data = await res.json()
                setVideos(data)
            } else if (res.status == 404) {
                showAlert("No Videos Found")
                setVideos([])
            } else if (res.status == 204) {
                null
            }
        }

        fetchVideos()
    }, [searchParams])
    
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

    const changeOptionsClass = (e) => {
        const options = document.querySelector('div.options')
        options.classList.toggle('active')
    }

    if (videos.length > 0) {
        return (
            <div className="search">
                <div className="header">
                    <h1 className="search-query">Search: {searchParams.get('q')}</h1>
                    <h1 className="search-options" onClick={changeOptionsClass}><i class='bx bx-filter'></i></h1>
                </div>
                <div className="options">
                    <ListGroup className="sort-by" defaultActiveKey={searchParams.get('sb') || 'v'} horizontal>
                        <ListGroup.Item action eventKey="v" onClick={() => navigate(`?q=${query}&sb=v`)}>
                            Views
                        </ListGroup.Item>
                        <ListGroup.Item action eventKey="u" onClick={() => navigate(`?q=${query}&sb=u`)}>
                            Upload Date
                        </ListGroup.Item>
                        <ListGroup.Item action eventKey="r" onClick={() => navigate(`?q=${query}&sb=r`)}>
                            Rating
                        </ListGroup.Item>
                    </ListGroup>
                </div>
                <div className="videos">
                    {console.log(videos)}
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