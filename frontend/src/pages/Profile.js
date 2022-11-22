import React, { useState, useEffect } from "react"
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import "../css/profile.css"

const Profile = ({ getCookie }) => {
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [profilePic, setProfilePic] = useState()
    const [newProfilePic, setNewProfilePic] = useState()

    useEffect(() => {
        const getAccountDetails = async () => {
            const res = await fetch('/api/account/getuser/')
            if (res.ok) {
                const data = await res.json()

                setName(data.name)
                setUsername(data.username)
                setProfilePic(data.profilePic)
            }
        }

        getAccountDetails()
    }, [])

    const onSubmit = async (e) => {
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

    return (
        <div className="profile">
            <div className="picture">
                <h3>Profile</h3>
                <img src={profilePic} className="profile-pic"></img>
            </div>
            <Form className="profile-form" onSubmit={onSubmit}>
                <Form.Label>Image</Form.Label>
                <Form.Control
                    type="file"
                    accept=".png,.jpeg,.jpg"
                    onChange={(e) => setNewProfilePic(e.target.files[0])}
                />
                <Form.Label>Name</Form.Label>
                <Form.Control 
                    type='text'
                    defaultValue={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Button type="submit">Save</Button>
            </Form>
        </div>
    )
}

export default Profile