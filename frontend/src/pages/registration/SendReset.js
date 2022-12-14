import React, { useState } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const SendReset = ({ showAlert, getCookie }) => {
    const [email, setEmail] = useState('')

    const onSubmit = async (e) => {
        e.preventDefault()

        const csrftoken = getCookie('csrftoken') 
        const res = await fetch(`/api/account/sendreset/`, {
            method: "POST",
            headers: {
                'X-CSRFToken': csrftoken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'email': email
            })
        })
        if (res.ok) {
            showAlert("Reset Email Sent")
        } else if (res.status == 404) {
            showAlert(`Account with email: ${email} not found`)
        }
    }

    return (
        <div className="reset-form">
            <Form onSubmit={onSubmit}>
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" required placeholder="Enter email" onChange={(e) => setEmail(e.target.value)}/>
                {/* <Form.Text className="text-muted">
                We'll never share your email with anyone else.
                </Form.Text> */}
                <Button type='submit' className="btn btn-block">Send Reset</Button>
            </Form>
        </div>
    )
}

export default SendReset;