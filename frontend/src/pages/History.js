import React, { useEffect, useState } from "react";
import VideoPreview from "../components/VideoPreview";
import Spinner from 'react-bootstrap/Spinner'
import "../css/history.css"

const History = ({ fetchVideo, showAlert }) => {
    const [videos, setVideos] = useState()

    useEffect(() => {
        fetchHistory()
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

    const fetchHistory = async () => {
        const res = await fetch('/api/account/history')
        if (res.ok) {
            const history = await res.json()
            setVideos(history)
        } else if (res.status == 403) {
            showAlert("Must be signed in to view history")
        } else if (res.status == 404) {
            (showAlert("No history to show"))
        } else {
            showAlert("Error getting history")
        }
    }

    if (videos != undefined) {
        return (
            <div className="history">
                {mapVideos()}
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