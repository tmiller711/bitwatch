import React, {useState} from "react";
import { useSearchParams } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate, Link } from "react-router-dom";

const ResetPassword = ({ showAlert, getCookie }) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [uid, setUID] = useState(searchParams.get('uid'))
    const [token, setToken] = useState(searchParams.get('token'))
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault()
        console.log(uid)
        console.log(token)

        if (password != confirmPassword) {
            showAlert("Passwords do not match")
            return
        }

        const csrftoken = getCookie('csrftoken')
        const res = await fetch(`/api/account/reset/${uid}/${token}/`, {
            method: "POST",
            headers: {
                'X-CSRFToken': csrftoken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'password': password
            })
        })

        if (res.ok) {
            showAlert("Password successfully reset")
            navigate("/login", {replace: true})

        } else {
            showAlert("Error reseting password")
        }
    }

    return (
        <div className="reset-password">
            <Form onSubmit={onSubmit}>
                <Form.Label>Password</Form.Label>
                <Form.Control
                    required
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New Password"
                />
                <Form.Label>Password</Form.Label>
                <Form.Control
                    required
                    type="password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm New Password"
                />
                <Form.Control.Feedback type="invalid">
                    Passwords do not match
                </Form.Control.Feedback>
                <Button type='submit' className="btn btn-block">Send Reset</Button>
            </Form>
        </div>
    )
}

export default ResetPassword;