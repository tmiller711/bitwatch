import React from "react";
import { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import "./registration.css"

const Register = ({ showAlert }) => {
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();

    const onSubmit = (e) => {
        e.preventDefault()

        registerUser({ email, username, password })

        // after submitting register form make the fields blank
        setEmail('')
        setUsername('')
        setPassword('')
    }

    const registerUser = ({ email, username, password }) => {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                email: email,
                username: username,
                password: password
            })
        };

        fetch('/api/account/register/', requestOptions).then((response) => {
            if (response.ok) {
                navigate("/login", {replace: true})
                showAlert(`Activation email sent to ${email} Please confirm!`)
            } else {
                showAlert(`Failed to send activation email to ${email}. Try again later`)
            }
        })
    }


    return (
        <div className="register-form">
            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" required placeholder="Enter email" onChange={(e) => setEmail(e.target.value)}/>
                    <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" required placeholder="Username" onChange={(e) => setUsername(e.target.value)}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" required placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                </Form.Group>

                <p>Want to login to an existing account instead? Click <Link to="/login">Here</Link></p>
                <Button type='submit' className="btn btn-block">Register</Button>
            </Form>
        </div>
    )
}

export default Register