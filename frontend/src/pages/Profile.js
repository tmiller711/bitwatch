import React, { useState, useEffect } from "react"
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import "../css/profile.css"

const Profile = () => {
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [profilePic, setProfilePic] = useState('')

    useEffect(() => {
        const getAccountDetails = async () => {
            const res = await fetch('/api/account/getuser/')
            if (res.ok) {
                const data = await res.json()

                setName(data.name)
                setUsername(data.username)
                setProfilePic(data.profilePic)
            } else {
                setName("Login")
            }
        }

        getAccountDetails()
    }, [])

    return (
        <Form className="profile">
            <h3>Profile</h3>
            <img src={profilePic} className="profile-pic"></img>
            

            <Form.Label>Name</Form.Label>
            <Form.Control 
                type='text'
                defaultValue={name}
            />
        </Form>
    )
}

export default Profile