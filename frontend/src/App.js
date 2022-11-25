import React from "react";
import { render } from "react-dom";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import SideNav from "./components/SideNav"
import HomePage from "./pages/HomePage"
import Subscriptions from "./pages/Subscriptions"
import History from "./pages/History"
import Profile from "./pages/Profile"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Upload from "./pages/Upload"
import Watch from "./pages/Watch"
import "./css/sidenav.css"
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {

	function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
	}

	const subscribe = async (subToID) => {
		const res = await fetch(`/api/account/subscribe/${subToID}`)
		if (res.ok) {
			return true
		} else {
			return false
		}
	}

	const unsubscribe = async (unsubID) => {
		const res = await fetch(`/api/account/unsubscribe/${unsubID}`)

		if (res.ok) {
			return true
		} else {
			return false
		}
	}
	
	return (
		<>
			<SideNav/>
			<div className="content">
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/login" element={<Login />} />
					<Route path='/register' element={<Register />} />
					<Route path="/subscriptions" element={<Subscriptions />} />
					<Route path="/history" element={<History />} />
					<Route path="/profile" element={<Profile getCookie={getCookie} />} />
					<Route path="/upload" element={<Upload getCookie={getCookie} />} />
					<Route path="/watch" element={<Watch getCookie={getCookie} subscribe={subscribe} 
													unsubscribe={unsubscribe} />} />
				</Routes>
			</div>
		</>
	)
}

export default App;