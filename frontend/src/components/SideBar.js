import React, { useEffect, useState } from "react";
import {Routes, Route, useNavigate, Link} from 'react-router-dom';
import '../css/sidebar.css';

const SideNav = ({ getCurTime }) => {
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [profilePic, setProfilePic] = useState('')
    const [loggedIn, setLoggedIn] = useState(false)
    const [url, setUrl] = useState('')

    useEffect(() => {
        const getAccountDetails = async () => {
            const res = await fetch('/api/account/getuser/')
            if (res.ok) {
                const data = await res.json()

                setName(data.name)
                setUsername(data.username)
                setProfilePic(data.profilePic)
                setLoggedIn(true)
                setUrl(`/channel?c=${data.id}`)
            } else {
                setName("Login")
            }
        }

        detectClick()
        getAccountDetails()
    }, [])

    const changeSideBarClass = () => {
        let sideBar = document.querySelector(".sidebar");
        sideBar.classList.toggle("open");
    }

    const changeSearchClass = () => {
        let searchBtn = document.querySelector(".bx-search");
        searchBtn.classList.toggle("open");
    }

    const profile = () => {
        return (
        <>
            <div className="profile-details">
                <Link to={url}>
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
    
    const detectClick = () => {
        let sideBar = document.querySelector(".sidebar")
        document.addEventListener("click", (event) => {
            if (sideBar.classList == "sidebar open") {
                console.log(event.target.classList)
                if (event.target.classList.value == "") {
                    sideBar.classList.remove("open")
                }
            }
        })
    }

    return (
        <div className="sidebar">
            <div className="logo-details">
                {/* <Link to="/" className="logo-link"> */}
                        <i className='bx bxl-c-plus-plus icon'></i>
                            <div className="logo_name">BitWatch</div>
                        <i className='bx bx-menu' id="btn" onClick={changeSideBarClass}></i>
                {/* </Link> */}
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
                <li>
                <Link to="/playlists" className="link">
                    <i class='bx bx-list-ul'></i>
                    <span className="links_name">Playlists</span>
                </Link>
                <span className="tooltip">Playlists</span>
                </li>
                <li className="upload">
                <Link to="/upload" className="link">
                    <i class='bx bx-upload'></i>
                    <span className="links_name">Upload</span>
                </Link>
                <span className="tooltip">Upload</span>
                </li>
                <li className="profile">
                    {loggedIn == true ? profile() : <Link to="login/">Log In</Link>} 
                </li>
            </ul>
        </div>
    )
}

export default SideNav
