import React, { useEffect, useState } from "react";
import VideoPreview from "../components/VideoPreview";
import Spinner from 'react-bootstrap/Spinner'
import "../css/history.css"

const History = ({ fetchVideo }) => {
    const [videos, setVideos] = useState([])

    useEffect(() => {
        const fetchHistory = async () => {
            const res = await fetch('/api/account/history')
            const history = await res.json()
            
            for (let i = 0; i < history.length; i++) {
                const data = await fetchVideo(history[i].id)
                setVideos(current => [...current, data])
            }
        }

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