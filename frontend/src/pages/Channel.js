import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from "react-bootstrap/Form";
import Modal from 'react-bootstrap/Modal'
import VideoPreview from "../components/VideoPreview";
import "../css/channel.css"

const Channel = ({ getCookie, subscribe, unsubscribe }) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [query, setQuery] = useState(searchParams.get('c'))
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [profilePic, setProfilePic] = useState()
    const [newProfilePic, setNewProfilePic] = useState()
    const [subscribers, setSubscribers] = useState(0)
    const [subscriptionStatus, setSubscriptionStatus] = useState()
    const [channelID, setChannelID] = useState()
    const [yourChannel, setYourChannel] = useState(false)
    const [show, setShow] = useState(false)
    const [videos, setVideos] = useState()

    useEffect(() => {
        const getAccountDetails = async () => {
            const res = await fetch(`/api/account/getuser/${query}`)
            if (res.ok) {
                const user = await res.json()

                setName(user.name)
                setUsername(user.username)
                setProfilePic(user.profilePic)
                setSubscribers(user.subscribers)
                setSubscriptionStatus(user.subscription_status)
                setChannelID(user.id)
                setYourChannel(user.isYou)
            }
        }

        const getChannelVideos = async () => {
            const res = await fetch(`/api/video/channelvideos/${query}`)
            const data = await res.json()

            setVideos(data)
        }

        getAccountDetails()
        getChannelVideos()
    }, [])
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const subscriptionButton = () => {
        const handleSubscribe = async () => {
            const status = await subscribe(channelID)
            if (status == true) {
                setSubscriptionStatus(true)
                setSubscribers(subscribers + 1)
            } else {
                alert("error")
            }
        }

        const handleUnsubscribe = async () => {
            const status = await unsubscribe(channelID)
            if (status == true) {
                setSubscriptionStatus(false)
                setSubscribers(subscribers - 1)
            } else {
                alert("error")
            }
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
				<VideoPreview key={video.id} video={video} edit={true} /> 
			))}
			</>
		)
	}

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
            <div className="channel-videos">
                {/* map to all of their videos */}
                {videos != undefined ? mapVideos() : null}
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
}

export default Channel