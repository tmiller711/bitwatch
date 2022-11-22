import React, { useEffect, useState } from "react";
import {Routes, Route, useNavigate, Link} from 'react-router-dom';
import '../css/sidenav.css';

const SideNav = ({ getCurTime }) => {
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [profilePic, setProfilePic] = useState('')
    const [loggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
        const getAccountDetails = async () => {
            const res = await fetch('/api/account/getuser/')
            if (res.ok) {
                const data = await res.json()

                setName(data.name)
                setUsername(data.username)
                setProfilePic(data.profilePic)
                setLoggedIn(true)
            } else {
                setName("Login")
            }
        }

        getAccountDetails()
    }, [])

    const changeSideBarClass = () => {
        let sideNav = document.querySelector(".sidebar");
        sideNav.classList.toggle("open");
    }

    const changeSearchClass = () => {
        let searchBtn = document.querySelector(".bx-search");
        searchBtn.classList.toggle("open");
    }

    const profile = () => {
        return (
        <>
            <div className="profile-details">
                <Link to="/profile">
                    <img src={profilePic} alt="bad" />
                </Link>
                <div className="name_job">
                    <div className="name">{name}</div>
                    <div className="username">{username}</div>
                </div>
            </div>
            <a href="/logout">
                <i className='bx bx-log-out' id="log_out" ></i>
            </a>
        </>
        )
    }

    return (
        <div className="sidebar">
            <div className="logo-details">
            <i className='bx bxl-c-plus-plus icon'></i>
                <div className="logo_name">BitWatch</div>
                <i className='bx bx-menu' id="btn" onClick={changeSideBarClass}></i>
            </div>
            <ul className="nav-list">
                <li>
                    <i className='bx bx-search' ></i>
                    <input type="text" placeholder="Search..." />
                    <span className="tooltip">Search</span>
                </li>
                <li>
                    <Link to="/" className="link">
                    <i className='bx bx-home-alt-2'></i>
                    <span className="links_name">Home</span>
                    </Link>
                    <span className="tooltip">Home</span>
                </li>
                <li>
                <Link to='/subscriptions' className="link">
                    <i className='bx bx-carousel'></i>
                    <span className="links_name">Subscriptions</span>
                </Link>
                <span className="tooltip">Subscriptions</span>
                </li>
                <li>
                <Link to="/history" className="link">
                    <i className='bx bx-history'></i>
                    <span className="links_name">History</span>
                </Link>
                <span className="tooltip">History</span>
                </li>
                <li className="upload">
                <Link to="/upload" className="link">
                    <i class='bx bx-upload'></i>
                    <span className="links_name">Upload</span>
                </Link>
                </li>
                <li className="profile">
                    {loggedIn == true ? profile() : <Link to="login/">Log In</Link>} 
                </li>
            </ul>
        </div>
    )
}

export default SideNav
