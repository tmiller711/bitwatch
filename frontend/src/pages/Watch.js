import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../css/watch.css";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const Watch = ({ getCookie }) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [query, setQuery] = useState(searchParams.get('v'))
    const [title, setTitle] = useState('')
    const [video, setVideo] = useState('')
    const [description, setDescription] = useState('')
    const [views, setViews] = useState(0)
    const [likes, setLikes] = useState(0)
    const [dislikes, setDislikes] = useState(0)
    const [profilePic, setProfilePic] = useState()

    const [uploader, setUploader] = useState('')
    const [subscribers, setSubscribers] = useState('')

    useEffect(() => {
        const getVideo = async () => {
            const video = await fetchVideo()
            
            setTitle(video.title)
            setVideo(video.video)
            setDescription(video.description)
            setLikes(video.likes)
            setDislikes(video.dislikes)
            setViews(video.views)

            fetchUploader(video.uploader)
        }

        getVideo()
    }, [])

    const fetchVideo = async () => {
        const csrftoken = getCookie('csrftoken')

        const res = await fetch('/api/video/get', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                id: query
            })
        })

        const data = await res.json()
        return data
    }

    const fetchUploader = async (id) => {
        const res = await fetch(`/api/account/getuser/${id}`)
        if (res.ok) {
            const data = await res.json()

            setUploader(data.username)
            setSubscribers(data.subscribers)
            setProfilePic(data.profilePic)
        }
    }

    const getVideo = () => {
        if (video != "") {
            return (
            <video className="video-player" controls>
                <source src={video} type="video/mp4" />
                {/* <source src="movie.ogg" type="video/ogg" /> */}
                Your browser does not support the video tag.
            </video>
        )
        }
    }

    const interactVideo = async (interaction) => {
        const videoID = query
        const csrftoken = getCookie("csrftoken")

        const res = await fetch(`/api/video/interact/${videoID}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                "interaction": interaction
            })
        })

        if (res.ok) {
            const data = await res.json()
            setLikes(data.likes)
            setDislikes(data.dislikes)
        } else {
            alert("Error")
        }
    }

    return (
        <div className="video-section">
            {getVideo()} 
            <h3 className="title">{title}</h3>
            <div className="interaction">
                <div className="uploader">
                    <img src={profilePic} className="profile-pic" />
                    <h4 className="user">{uploader}<br /><p className="subscribers">{subscribers} Subscribers</p></h4>
                    <Button className="subscribe">Subscribe</Button>
                </div>
                <h4 className="likes"><i className='bx bx-upvote like' onClick={() => interactVideo('like')}></i>{likes}</h4>
                <h4 className="dislikes"><i className='bx bx-downvote dislike' onClick={() => interactVideo('dislike')}></i>{dislikes}</h4>
            </div>
        </div>
    )
}

export default Watch