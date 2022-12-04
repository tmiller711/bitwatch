import React, { useEffect, useState } from "react"
import "../css/comments.css"
import { Link } from "react-router-dom"

const Comment = ({ comment }) => {
    const [channelLink, setChannelLink] = useState()

    useEffect(() => {
        setChannelLink(`/channel?c=${comment.user}`)

    }, [])

    const changeCommentClass = (e) => {
        e.target.parentNode.classList.toggle('active')
    }

    return (
        <div className="comment" onClick={changeCommentClass}>
            <div className="channel-link">
                <p><Link to={channelLink} className="channel-link">{comment.username} - {comment.created_ago} </Link></p>
            </div>
            {/* <br /> */}
            <p>{comment.text}</p>
        </div>
    )
}

export default Comment