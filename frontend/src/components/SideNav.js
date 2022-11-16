import React, { useEffect, useState } from "react";
import {Routes, Route, useNavigate, Link} from 'react-router-dom';
// import '../css/sidenav.css';

const SideNav = ({ getCurTime }) => {

    const changeSideBarClass = () => {
        let sideNav = document.querySelector(".sidebar");
        sideNav.classList.toggle("open");
    }

    const changeSearchClass = () => {
        let searchBtn = document.querySelector(".bx-search");
        searchBtn.classList.toggle("open");
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
                    <a href="#">
                    <i class='bx bx-home-alt-2'></i>
                    <span className="links_name">Home</span>
                    </a>
                    <span className="tooltip">Home</span>
                </li>
                <li>
                <a href="#">
                    <i class='bx bx-carousel'></i>
                    <span className="links_name">Subscriptions</span>
                </a>
                <span className="tooltip">Subscriptions</span>
                </li>
                <li className="profile">
                    <div className="profile-details">
                    <img src="profile.jpg" alt="profileImg" />
                    <div className="name_job">
                        <div className="name">Prem Shahi</div>
                        <div className="job">Web designer</div>
                    </div>
                    </div>
                    <i className='bx bx-log-out' id="log_out" ></i>
                </li>
            </ul>
        </div>
    )
}

export default SideNav
