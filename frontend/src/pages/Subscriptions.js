import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import "../css/subscriptions.css"

const Subscriptions = () => {
    const [subscriptions, setSubscriptions] = useState()

    useEffect(() => {
        const fetchSubscriptions = async () =>{
            const res = await fetch('/api/account/subscriptions/')
            const data = await res.json()
            
            setSubscriptions(data)
        }

        fetchSubscriptions()
    }, [])

    const mapSubscriptions = () => {
        return (
            <>
            {subscriptions.map((channel) => (
                <div className="subscriptions">
                    <Link to={`/channel?c=${channel.id}`} className='channel-link'>
                        <img src={channel.profilePic} className="profile-pic" />
                        <h1>{channel.username}</h1>
                    </Link>
                </div>
            ))}
            </>
        )
    }

    return (
        <>
        <h1>Subscriptions Pages</h1>
        {/* {subscriptions.username} */}
        {subscriptions != undefined ? mapSubscriptions() : null}
        </>
    )
}

export default Subscriptions