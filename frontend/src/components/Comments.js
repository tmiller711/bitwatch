import React, { useEffect, useState } from "react"
import Comment from "./Comment"
import Form from "react-bootstrap/Form"

const Comments = ({ videoID }) => {
    const [comments, setComments] = useState()
    const [numOfComments, setNumOfComments] = useState(0)

    useEffect(() => {
        const fetchComments = async () => {
            const res = await fetch(`/api/video/getcomments/${videoID}`)
            const data = await res.json()
            
            setComments(data)
            setNumOfComments(data.length)
        }

        fetchComments()
    }, [])

    const mapComments = () => {
        return (
            <>
                {comments.map((comment) => (
                    <Comment key={comment.user} comment={comment} />
                ))} 
            </>
        )
    }

    return (
        <>
        <h1>{numOfComments} Comments:</h1>
        <Form className="add-comment-form">
            <Form.Control
                type="text"
                placeholder="Add a comment..."
            />
            {/* when they highlight the text input pop up the buttont to submit the comment */}
        </Form>
        {/* make add comment and list the number of comments */}
        {comments != undefined ? mapComments() : null}
        </>
    )
}

export default Comments