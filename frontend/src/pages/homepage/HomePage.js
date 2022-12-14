import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import VideoPreview from "../../components/videos/videopreview/VideoPreview";
import Spinner from 'react-bootstrap/Spinner'
import "./homepage.css"
import { useSelector } from "react-redux";

const HomePage = (props) => {
	const [videos, setVideos] = useState([])
	const [page, setPage] = useState(1)

	useEffect(() => {
		setVideos([])
		setPage(1)
	}, [])
	
	useEffect(() => {
        const fetchVideos = async () => {
            const res = await fetch(`/api/video/getvideos/${page}`)
            const data = await res.json()
            
			setVideos([...videos, ...data])
        }

		fetchVideos()
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

	if (videos.length > 0) {
		return (
			<div className="homepage">
				{videos.map((video) => (
					<VideoPreview key={video.video_id} video={video} uploader_info={video.uploader_info} /> 
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

export default HomePage
