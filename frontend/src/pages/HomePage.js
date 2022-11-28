import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import VideoPreview from "../components/VideoPreview";
import "../css/homepage.css"

const HomePage = (props) => {
	const [videos, setVideos] = useState()

	useEffect(() => {
        const fetchVideos = async () => {
            const res = await fetch('/api/video/getvideos')
            const data = await res.json()
            
			setVideos(data)
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
		<div className="homepage">
			{videos != undefined ? mapVideos() : null}
		</div>
	)
}

export default HomePage
