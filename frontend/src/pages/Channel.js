import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from "react-bootstrap/Form";
import Modal from 'react-bootstrap/Modal'
import Nav from 'react-bootstrap/Nav';
import Spinner from 'react-bootstrap/Spinner'
import VideoPreview from "../components/VideoPreview";
import PlaylistPreview from "../components/PlaylistPreview";
import "../css/channel.css"

const Channel = ({ getCookie, subscribe, unsubscribe }) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [query, setQuery] = useState()
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [profilePic, setProfilePic] = useState()
    const [newProfilePic, setNewProfilePic] = useState()
    const [subscribers, setSubscribers] = useState(0)
    const [subscriptionStatus, setSubscriptionStatus] = useState()
    const [channelID, setChannelID] = useState()
    const [yourChannel, setYourChannel] = useState(false)
    const [show, setShow] = useState(false)
    const [videos, setVideos] = useState([])
    const [playlists, setPlaylists] = useState()
 
	const [page, setPage] = useState(1)

    useEffect(() => {
        setQuery(searchParams.get('c'))

        const getAccountDetails = async () => {
            const res = await fetch(`/api/account/getuser/${query}`)
            if (res.ok) {
                const user = await res.json()

                setName(user.name)
                setUsername(user.username)
                setProfilePic(user.profile_pic)
                setSubscribers(user.subscribers)
                setSubscriptionStatus(user.subscription_status)
                setChannelID(user.id)
                setYourChannel(user.is_you)
            }
        }

        const getChannelVideos = async () => {
            const res = await fetch(`/api/video/channelvideos/${query}`)
            const data = await res.json()

            setVideos(data)
        }

        const fetchPlaylists = async () => {
            const res = await fetch(`/api/account/getplaylists/${query}`)
            const data = await res.json()

            setPlaylists(data)
        }

        fetchPlaylists()
        getAccountDetails()
        getChannelVideos()
    }, [query, searchParams])

    useEffect(() => {
        const getChannelVideos = async () => {
            const res = await fetch(`/api/video/channelvideos/${query}?page=${page}`)
            const data = await res.json()

            setVideos([...videos, ...data])
        }

        getChannelVideos()
    }, [page])
    
    useEffect(() => {
		window.addEventListener('scroll', handleScroll)

		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	})
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
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

    const subscriptionButton = () => {
        const handleSubscribe = async (uploaderID) => {
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

        const handleUnsubscribe = async (uploaderID) => {
            const res = await unsubscribe(uploaderID)
            if (res.ok) {
                setSubscriptionStatus(false)
                setSubscribers(subscribers - 1)
            } else (
                showAlert("Error unsubscribing")
            )
        }

        if (subscriptionStatus == false) {
            return (<Button className="subscribe" onClick={() => handleSubscribe(channelID)}>Subscribe</Button>)
        } else if (subscriptionStatus == true) {
            return (<Button className="subscribe" onClick={() => handleUnsubscribe(channelID)}>Unsubscribe</Button>)
        }
    }

    const handleSave = async (e) => {
        e.preventDefault()
        const csrftoken = getCookie('csrftoken')
        const uploadData = new FormData();
        uploadData.append('name', name);
        if (newProfilePic != undefined) {
            uploadData.append('profile_pic', newProfilePic, newProfilePic.name)
        }
        
        const res = await fetch("/api/account/profile/", {
            method: "POST",
            headers: {
                "X-CSRFToken": csrftoken,
            },
            body: uploadData
        }).then(async res => {
            if (res.ok) {
                const data = await res.json()
                setProfilePic(data.profilePic)
            }
        })
        .catch(error => console.log(error))
    }
 
	const mapVideos = () => {
		return (
			<>
			{videos.map((video) => (
				<VideoPreview key={video.id} video={video} edit={yourChannel} /> 
			))}
			</>
		)
	}
    
    const mapPlaylists = () => {
        if (playlists) {
        return (
        <>
            {playlists.map((playlist) => (
                <PlaylistPreview key={playlist.id} playlist={playlist} />
            ))} 
        </>
        )
        }
    }

    const changeActiveClass = (eventKey) => {
        let channelPlaylists = document.querySelector(".channel-playlists")
        let channelVideos = document.querySelector(".channel-videos")

        channelPlaylists.classList.toggle('active')
        channelVideos.classList.toggle('active')
    }

    if (videos != undefined && username != ""){
        return (
            <div className="channel">
                <div className="channel-details">
                    <img src={profilePic} className="profile-pic" />
                    <div className="details">
                        <p className="name">{name}</p>
                        <p className="username">@{username}</p>
                        <p className="subscribers">{subscribers} subscribers</p>
                    </div>
                    <div className="buttons">
                        {yourChannel == true ? 
                            <>
                            <Button className="edit-channel" onClick={handleShow}>Edit Channel</Button> 
                            </>
                            : subscriptionButton()
                        }
                    </div>
                </div>
                <Nav fill variant="tabs" defaultActiveKey="show-videos" onSelect={changeActiveClass}>
                    <Nav.Item>
                        <Nav.Link eventKey="show-videos">Videos</Nav.Link>
                        {/* when they click on one make it update the classname of of something to make either the videos or the playlists appear */}
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="show-playlists">Playlists</Nav.Link>
                    </Nav.Item>
                </Nav>
                <div className="channel-videos active">
                    {/* map to all of their videos */}
                    {mapVideos()}
                </div>

                <div className="channel-playlists">
                    {mapPlaylists()}
                </div>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header>
                        <Modal.Title>Channel Settings</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type='text'
                                defaultValue={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <Form.Label>Profile Picture</Form.Label>
                            <Form.Control
                                type='file'
                                accept='.png, .jpg, .jpeg'
                                onChange={(e) => setNewProfilePic(e.target.files[0])}
                            />
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={handleClose}>
                            Close
                        </Button>
                        <Button onClick={handleSave}>
                            Save
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    } else {
        return (
            <div classname="loading">
                <Spinner animation="border" role="status" classname="spinner">

                </Spinner>
            </div>
        )
    }
    
}

export default Channel