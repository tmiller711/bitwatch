import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import Spinner from 'react-bootstrap/Spinner'
import "./subscriptions.css"

const Subscriptions = ({ showAlert }) => {
    const [subscriptions, setSubscriptions] = useState()

    useEffect(() => {
        const fetchSubscriptions = async () =>{
            const res = await fetch('/api/account/subscriptions/')
            if (res.ok) {
                const data = await res.json()
                
                setSubscriptions(data)
            } else if (res.status == 403) {
                showAlert("Must be signed in to view subscriptions")
            } else if (res.status == 404) {
                showAlert("No subscriptions to show")
            } else {
                showAlert("Error getting subscriptions")
            }
        }

        fetchSubscriptions()
    }, [])

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

    if (subscriptions != undefined) {
        return (
            <>
            <h1>Subscriptions Pages</h1>
            {mapSubscriptions()}
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