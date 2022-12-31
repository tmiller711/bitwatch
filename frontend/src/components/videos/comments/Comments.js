import React, { useEffect, useState } from "react"
import Comment from "./Comment"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"

const Comments = ({ videoID, getCookie, firstComments, showAlert }) => {
    const [comments, setComments] = useState(firstComments)
    const [numOfComments, setNumOfComments] = useState(firstComments.length)
    const [page, setPage] = useState(2)

    const [newComment, setNewComment] = useState("")

    useEffect(() => {
        const fetchComments = async () => {
            const res = await fetch(`/api/video/getcomments/${videoID}/${page}`)
            const data = await res.json()
            
            setComments([...comments, ...data])
            setNumOfComments(comments.length += data.length)
        }

        fetchComments()
    }, [page])

	useEffect(() => {
		window.addEventListener('scroll', handleScroll)

		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	})

	const handleScroll = () => {
		const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
		const body = document.body;
		const html = document.documentElement;
		const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
		const windowBottom = windowHeight + window.pageYOffset;
		if (windowBottom >= docHeight) {
			setPage(page + 1)
		}
	}

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
        if (newComment.length < 5) {
            return
        }
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
                setNumOfComments(numOfComments + 1)
                e.target.reset()
            } else if (res.status == 403) {
                showAlert("Must be signed in to comment")
            } else {
                showAlert("Error adding comment")
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
            />
            <Button type="submit" id="submit-button">Comment</Button>
        </Form>
        {mapComments()}
        </>
    )
}

export default Comments