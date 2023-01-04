import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux"
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { loginSuccess } from "../../features/userSlice";
import "./registration.css"
import auth from "../../features/userSlice";

const Login = ({ showAlert }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onSubmit = (e) => {
        e.preventDefault()

        loginUser({ email, password })

        // after submitting register form make the fields blank
        setEmail('')
        setPassword('')
    }

    const loginUser = ({ email, password }) => {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                email: email,
                password, password
            })
        };

        fetch('/api/account/login/', requestOptions).then((response) => {
            if(response.ok){
                dispatch(loginSuccess({
                    email: email
                }));
                navigate("/", {replace: true})
            } else {
                showAlert("Invalid Credentials")
            }
        })
    }

    return (
        <div className="login-form">
            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" required placeholder="Enter email" onChange={(e) => setEmail(e.target.value)}/>
                    <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" required placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                </Form.Group>

                <p>Want to register an account instead? Click <Link to="/register">Here</Link></p>
                <p>Reset Password <Link to="/sendreset">Here</Link></p>
                <Button type='submit' className="btn btn-block">Login</Button>
            </Form>
            <div id="signInButton">

            </div>
        </div>
    )
}

export default Login