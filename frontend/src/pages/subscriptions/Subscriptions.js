import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import Spinner from 'react-bootstrap/Spinner'
import VideoPreview from "../../components/videos/videopreview/VideoPreview";
import "./subscriptions.css"

const Subscriptions = ({ showAlert }) => {
    const [subscriptions, setSubscriptions] = useState()
    const [videos, setVideos] = useState([])
    const [page, setPage] = useState(1)

    useEffect(() => {
        const fetchSubscriptions = async () =>{
            const res = await fetch(`/api/account/subscriptions/${page}`)
            if (res.ok) {
                const data = await res.json()
                
                setSubscriptions(data.channels)
                setVideos(data.videos)
            } else if (res.status == 403) {
                showAlert("Must be signed in to view subscriptions")
            } else if (res.status == 404) {
                showAlert("No videos to show")
            } else {
                showAlert("Error getting subscriptions")
            }
        }

        fetchSubscriptions()
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

    const mapSubscriptions = () => {
        return (
            <>
            {subscriptions.map((channel) => (
                <div className="subscriptions">
                    <Link to={`/channel?c=${channel.id}`} className='channel-link'>
                        <img src={channel.profile_pic} className="profile-pic" />
                        <h1>{channel.username}</h1>
                    </Link>
                </div>
            ))}
            </>
        )
    }
    
    const mapVideos = () => {
		return (
			<>
			{videos.map((video) => (
				<VideoPreview key={video.video_id} video={video} /> 
			))}
			</>
		)
	}

    if (subscriptions != undefined) {
        return (
            <>
            <h1>Subscriptions</h1>
            {/* {mapSubscriptions()} */}
            <div className="videos">
                {mapVideos()}
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

export default Subscriptions