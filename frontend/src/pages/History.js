import React, { useEffect, useState } from "react";
import VideoPreview from "../components/VideoPreview";
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

    return (
        <div className="history">
        {videos != undefined ? mapVideos() : null}
        </div>
    )
}

export default History