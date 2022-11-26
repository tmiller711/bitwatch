import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import "../css/videointeraction.css"

const VideoInteraction = ({ subscribe, unsubscribe, fetchVideo, query, getCookie }) => {
    const [likes, setLikes] = useState(0)
    const [dislikes, setDislikes] = useState(0)
    const [profilePic, setProfilePic] = useState()
    const [uploaderID, setUploaderID] = useState()
    const [subscriptionStatus, setSubscriptionStatus] = useState(false)

    const [uploader, setUploader] = useState('')
    const [subscribers, setSubscribers] = useState('')

    useEffect(() => {
        const getVideo = async () => {
            const video = await fetchVideo(query)
            
            setLikes(video.likes)
            setDislikes(video.dislikes)
            setUploaderID(video.uploader)

            fetchUploader(video.uploader)
        }

        interactVideo('view')
        getVideo()
    }, [])

    const fetchUploader = async (id) => {
        const res = await fetch(`/api/account/getuser/${id}`)
        if (res.ok) {
            const data = await res.json()

            setUploader(data.username)
            setSubscribers(data.subscribers)
            setProfilePic(data.profilePic)
            setSubscriptionStatus(data.subscription_status)
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

    const subscriptionButton = () => {
        const handleSubscribe = async () => {
            const status = await subscribe(uploaderID)
            if (status == true) {
                setSubscriptionStatus(true)
                setSubscribers(subscribers + 1)
            } else {
                alert("error")
            }
        }

        const handleUnsubscribe = async () => {
            const status = await unsubscribe(uploaderID)
            if (status == true) {
                setSubscriptionStatus(false)
                setSubscribers(subscribers - 1)
            } else {
                alert("error")
            }
        }

        if (subscriptionStatus == false) {
            return (<Button className="subscribe" onClick={() => handleSubscribe(uploaderID)}>Subscribe</Button>)
        } else if (subscriptionStatus == true) {
            return (<Button className="subscribe" onClick={() => handleUnsubscribe(uploaderID)}>Unsubscribe</Button>)
        }
    }

    return (
        <div className="interaction">
            <div className="uploader">
                <img src={profilePic} className="profile-pic" />
                <h4 className="user">{uploader}<br /><p className="subscribers">{subscribers} Subscribers</p></h4>
                {subscriptionButton()}
            </div>
            <h4 className="likes"><i className='bx bx-upvote like' onClick={() => interactVideo('like')}></i>{likes}</h4>
            <h4 className="dislikes"><i className='bx bx-downvote dislike' onClick={() => interactVideo('dislike')}></i>{dislikes}</h4>
        </div>
    )
}

export default VideoInteraction