import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import "../css/videointeraction.css"
import { Link } from 'react-router-dom';

const VideoInteraction = ({ subscribe, unsubscribe, fetchVideo, query, getCookie }) => {
    const [likes, setLikes] = useState(0)
    const [dislikes, setDislikes] = useState(0)
    const [profilePic, setProfilePic] = useState()
    const [uploaderID, setUploaderID] = useState()
    const [subscriptionStatus, setSubscriptionStatus] = useState(false)
    const [show, setShow] = useState(false)

    const [uploader, setUploader] = useState('')
    const [subscribers, setSubscribers] = useState('')
    const [yourVideo, setYourVideo] = useState()

    const [playlists, setPlaylists] = useState()
    const [newPlaylist, setNewPlaylist] = useState('')

    useEffect(() => {
        const getVideo = async () => {
            const video = await fetchVideo(query)
            
            setLikes(video.likes)
            setDislikes(video.dislikes)
            setUploaderID(video.uploader)

            fetchUploader(video.uploader)
        }

        const fetchPlaylists = async () => {
            const res = await fetch('/api/account/getplaylists')
            const data = await res.json()

            setPlaylists(data)
            console.log(data)
        }

        fetchPlaylists()
        interactVideo('view')
        getVideo()
    }, [])
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const fetchUploader = async (id) => {
        const res = await fetch(`/api/account/getuser/${id}`)
        if (res.ok) {
            const data = await res.json()

            setUploader(data.username)
            setSubscribers(data.subscribers)
            setProfilePic(data.profilePic)
            setSubscriptionStatus(data.subscription_status)
            setYourVideo(data.isYou)
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

    const updatePlaylist = async (id) => {
        // e.preventDefault()
        const csrftoken = getCookie('csrftoken')

        const res = await fetch(`/api/account/updateplaylist/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": 'application/json',
                "X-CSRFToken": csrftoken
            },
            body: JSON.stringify({
                video: query
            })
        })
    }

    const createPlaylist = async (e) => {
        if (newPlaylist == '') {
            alert("Please input a playlist name")
            return
        }
        const csrftoken = getCookie('csrftoken')

        const res = await fetch('/api/account/createplaylist/', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                name: newPlaylist
            })
        }).then(async res => {
            if (res.ok) {
                const data = await res.json()
                setPlaylists([...playlists, data])
            }
        })
    }

    const checkVideoInPlaylist = (playlist) => {
        const videos = playlist.videos

        for (let i = 0; i < videos.length; i++) {
            if (query == videos[i]) {
                return true
            }
        }

        return false
    }

    return (
        <div className="interaction">
            <div className="uploader">
                <img src={profilePic} className="profile-pic" />
                <Link to={`/channel?c=${uploaderID}`} className="channel-link">
                    <h4 className="user">{uploader}<br /><p className="subscribers">{subscribers} Subscribers</p></h4>
                </Link>
                {yourVideo == false ?
                    subscriptionButton()
                    : null
                }
            </div>
            <div className="interact">
                <h4 className="likes"><i className='bx bx-upvote like' onClick={() => interactVideo('like')}></i>{likes}</h4>
                <h4 className="dislikes"><i className='bx bx-downvote dislike' onClick={() => interactVideo('dislike')}></i>{dislikes}</h4>
                <div className="save" onClick={handleShow}>
                    <p><i class='bx bx-dots-horizontal-rounded' />Save</p>
                    {/* <p>Save</p> */}
                </div>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>Channel Settings</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {playlists != undefined ? playlists.map((playlist) => (
                            <>
                                <InputGroup>
                                <InputGroup.Checkbox defaultChecked={checkVideoInPlaylist(playlist)} onClick={(e) => updatePlaylist(playlist.id)} />
                                <Form.Control
                                    value={playlist.name}
                                    readOnly
                                />
                                </InputGroup>
                            </>
                        )) : null}
                        <Form.Label>Create Playlist</Form.Label>
                        <Form.Control
                            type='text'
                            onChange={(e) => setNewPlaylist(e.target.value)}
                        />
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose}>
                        Close
                    </Button>
                    <Button onClick={createPlaylist}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default VideoInteraction