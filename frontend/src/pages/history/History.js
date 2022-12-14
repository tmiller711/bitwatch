import React, { useEffect, useState } from "react";
import LongVideoPreview from "../../components/videos/longvideopreview/LongVideoPreview";
import Spinner from 'react-bootstrap/Spinner'
import "./history.css"

const History = ({ fetchVideo, showAlert }) => {
    const [videos, setVideos] = useState([])
	const [page, setPage] = useState(1)

    useEffect(() => {
        fetchHistory()
    }, [page])

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

    const fetchHistory = async () => {
        const res = await fetch(`/api/account/history/${page}`)
        if (res.ok) {
            const history = await res.json()
            setVideos([...videos, ...history])
        } else if (res.status == 403) {
            showAlert("Must be signed in to view history")
        } else if (res.status == 404) {
            (showAlert("No history to show"))
        } else {
            showAlert("Error getting history")
        }
    }

    if (videos.length > 0) {
        return (
            <div className="history">
                <h1>History</h1>
                {videos.map((video) => (
                    <LongVideoPreview key={video.video_id} video={video} uploader_info={video.uploader_info} /> 
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

export default History