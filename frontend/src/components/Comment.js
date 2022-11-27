import React, { useEffect, useState } from "react"
import "../css/comments.css"
import { Link } from "react-router-dom"

const Comment = ({ comment }) => {
    const [channelLink, setChannelLink] = useState()

    useEffect(() => {
        setChannelLink(`/channel?c=${comment.user}`)

    }, [])

    return (
        <div className="comment">
            <p><Link to={channelLink} className="channel-link">{comment.username}</Link> - {comment.created_ago}</p>
            <p>{comment.text}</p>
        </div>
    )
}

export default Comment