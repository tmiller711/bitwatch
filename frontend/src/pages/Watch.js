import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../css/watch.css";

const Watch = ({ getCookie }) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [query, setQuery] = useState(searchParams.get('v'))
    const [title, setTitle] = useState('')
    const [video, setVideo] = useState('')
    const [description, setDescription] = useState('')
    const [views, setViews] = useState(0)
    const [likes, setLikes] = useState(0)
    const [dislikes, setDislikes] = useState(0)

    const [uploader, setUploader] = useState('')
    const [subscribers, setSubscribers] = useState('')

    useEffect(() => {
        const getVideo = async () => {
            const video = await fetchVideo()
            
            setTitle(video.title)
            setVideo(`http://127.0.0.1:8000${video.video}`)
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
        console.log(title)
        const res = await fetch(`/api/account/getuser/${id}`)
        if (res.ok) {
            const data = await res.json()

            setUploader(data.username)
            setSubscribers(data.subscribers)
        }
    }

    // const getUrl = () => {
    //     return `${video}`
    // }

    return (
        <div className="video-section">
            <video className="video-player" controls>
                <source src="http://127.0.0.1:8000/media/videos/test_video.mp4" type="video/mp4" />
                {/* <source src="movie.ogg" type="video/ogg" /> */}
                Your browser does not support the video tag.
            </video>
            <h3 className="title">{title}</h3>
            <div className="interaction">
                <h4 className="user">{uploader}</h4>
                <h4 className="likes"><i class='bx bx-upvote'></i>{likes}</h4>
                <h4 className="dislikes"><i class='bx bx-downvote'></i>{dislikes}</h4>
            </div>
        </div>
    )
}

export default Watch