import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import VideoPreview from "../components/VideoPreview";

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

	const test = () => {
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
			{videos != undefined ? test() : null}
		</>
	)
}

export default HomePage
