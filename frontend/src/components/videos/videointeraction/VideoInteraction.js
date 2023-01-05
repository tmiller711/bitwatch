import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import "./videointeraction.css"
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";

const VideoInteraction = ({ uploaderID, subscribe, unsubscribe, query, getCookie, showAlert }) => {
    const [likes, setLikes] = useState(0)
    const [dislikes, setDislikes] = useState(0)
    const [profilePic, setProfilePic] = useState()
    const [subscriptionStatus, setSubscriptionStatus] = useState(false)
    const [show, setShow] = useState(false)
    
    const authenticated = useSelector((state) => state.auth.authenticated)
    const user = useSelector((state) => state.auth.currentUser)

    const [uploader, setUploader] = useState('')
    const [subscribers, setSubscribers] = useState('')
    const [yourVideo, setYourVideo] = useState()

    const [playlists, setPlaylists] = useState()
    const [newPlaylist, setNewPlaylist] = useState('')
    const [privateStatus, setPrivateStatus] = useState('true')

    useEffect(() => {
        const fetchPlaylists = async () => {
            const res = await fetch('/api/account/getplaylists')
            if (res.ok) {
                const data = await res.json()

                setPlaylists(data)
            }
        }

        fetchPlaylists()
        interactVideo('view')
        fetchUploader(uploaderID)
    }, [])
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const fetchUploader = async (id) => {
        const res = await fetch(`/api/account/getuser/${id}`)
        if (res.ok) {
            const data = await res.json()

            setUploader(data.username)
            setSubscribers(data.subscribers)
            setProfilePic(data.profile_pic)
            setSubscriptionStatus(data.subscription_status)
            setYourVideo(data.is_you)
        }
    }

    const interactVideo = async (action) => {
        const videoID = query
        const csrftoken = getCookie("csrftoken")

        const res = await fetch(`/api/video/interact/${videoID}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                "action": action
            })
        })

        if (res.ok) {
            const data = await res.json()
            setLikes(data.num_likes)
            setDislikes(data.num_dislikes)
        } else if (res.status == 403) {
            showAlert("Must be signed in to interact with video")
        } else {
            showAlert("Error")
        }
    }

    const subscriptionButton = () => {
        const handleSubscribe = async () => {
            const res = await subscribe(uploaderID)
            if (res.ok) {
                setSubscriptionStatus(true)
                setSubscribers(subscribers + 1)
            } else if (res.status == 403) {
                showAlert("Must be signed in to subscribe")
            } else (
                showAlert("Error subscribing")
            )
        }

        const handleUnsubscribe = async () => {
            const res = await unsubscribe(uploaderID)
            if (res.ok) {
                setSubscriptionStatus(false)
                setSubscribers(subscribers - 1)
            } else (
                showAlert("Error unsubscribing")
            )
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

        const res = await fetch(`/api/account/updateplaylist/${id}/${query}`, {
            method: "PUT",
            headers: {
                "Content-Type": 'application/json',
                "X-CSRFToken": csrftoken
            }
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
                name: newPlaylist,
                status: privateStatus
            })
        }).then(async res => {
            if (res.ok) {
                const data = await res.json()
                setPlaylists([...playlists, data])
            } else if (res.status == 403) {
                showAlert("Must be signed in to create playlist")
            } else {
                showAlert("Error creating playlist")
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
                {authenticated && user.id != uploaderID ?
                    subscriptionButton()
                    : null
                }
            </div>
            <div className="interact">
                <h4 className="likes"><i className='bx bx-upvote like' onClick={() => interactVideo('like')}></i>{likes}</h4>
                <h4 className="dislikes"><i className='bx bx-downvote dislike' onClick={() => interactVideo('dislike')}></i>{dislikes}</h4>
                <div className="save" onClick={handleShow}>
                    <p><i className='bx bx-dots-horizontal-rounded' />Save</p>
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
                        <Form.Select onChange={(e) => setPrivateStatus(e.target.value)}>
                        <option value={true}>Private</option>
                        <option value={false}>Public</option>
                        </Form.Select>
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