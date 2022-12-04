import React, { useEffect, useState } from "react"
import Comment from "./Comment"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"

const Comments = ({ videoID, getCookie }) => {
    const [comments, setComments] = useState()
    const [numOfComments, setNumOfComments] = useState(0)

    const [newComment, setNewComment] = useState("")

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
                    <Comment key={comment.id} comment={comment} />
                ))} 
            </>
        )
    }

    const addComment = async (e) => {
        e.preventDefault()
        const csrftoken = getCookie('csrftoken')

        const res = await fetch(`/api/video/addcomment/${videoID}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken
            },
            body: JSON.stringify({
                comment: newComment
            })
        }).then(async res => {
            if (res.ok) {
                const data = await res.json()
                setComments([data, ...comments])
                e.target.reset()
            }
        })
        .catch(error => console.log(error))
    }

    const changeFormClass = () => {
        let commentForm = document.querySelector("#submit-button")
        commentForm.classList.toggle('active')
    }

    return (
        <>
        <h1>{numOfComments} Comments:</h1>
        <Form className="add-comment-form" onSubmit={addComment}>
            <Form.Control
                type="text"
                placeholder="Add a comment..."
                onChange={(e) => {setNewComment(e.target.value)}}
                onFocus={(e) => changeFormClass()}
                // onBlur={() => changeFormClass()}
            />
            <Button type="submit" id="submit-button">Comment</Button>
        </Form>
        {comments != undefined ? mapComments() : null}
        </>
    )
}

export default Comments