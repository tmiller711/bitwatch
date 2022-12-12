import React, { useEffect, useState, useRef } from "react"
import "../css/comments.css"
import { Link } from "react-router-dom"

const Comment = ({ comment }) => {
    const [channelLink, setChannelLink] = useState()
    const commentElement = useRef(null)

    useEffect(() => {
        setChannelLink(`/channel?c=${comment.user}`)

    }, [])

    const changeCommentClass = (e) => {
        commentElement.current.classList.toggle('active')
        // e.target.parentNode.classList.toggle('active')
    }

    return (
        <div className="comment" onClick={changeCommentClass} ref={commentElement}>
            <div className="channel-link">
                <p><Link to={channelLink}  className="channel-link">{comment.username} - {comment.created_ago} </Link></p>
            </div>
            {/* <br /> */}
            <p>{comment.text}</p>
        </div>
    )
}

export default Comment