import React, {useState} from "react";
import { render } from "react-dom";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import SideBar from "./components/SideBar"
import HomePage from "./pages/HomePage"
import Subscriptions from "./pages/Subscriptions"
import History from "./pages/History"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Upload from "./pages/Upload"
import Watch from "./pages/Watch"
import Channel from "./pages/Channel";
import Playlists from "./pages/Playlists";
import ViewPlaylist from "./pages/ViewPlaylist";
import Search from "./pages/Search";
import { Alert } from 'react-bootstrap';
import "./css/sidebar.css"
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
	const [alertShow, setAlertShow] = useState(false)
	const [alertText, setAlertText] = useState('')

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
		return res
	}

	const unsubscribe = async (unsubID) => {
		const res = await fetch(`/api/account/unsubscribe/${unsubID}`)
		return res
	}

    const fetchVideo = async (query) => {
        const csrftoken = getCookie('csrftoken')

        const res = await fetch(`/api/video/get/${query}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
        })

        const data = await res.json()
        return data
    }

	const showAlert = (text) => {
		setAlertShow(true)
		setAlertText(text)
	}
	
	return (
		<>
			<SideBar/>
			<div className="content">
				{alertShow && (
					<Alert variant="danger" className="alert" onClose={() => setAlertShow(false)} dismissible>
						{alertText}
					</Alert>
				)}
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/login" element={<Login />} />
					<Route path='/register' element={<Register showAlert={showAlert} />} />
					<Route path="/subscriptions" element={<Subscriptions showAlert={showAlert} />} />
					<Route path="/history" element={<History fetchVideo={fetchVideo} showAlert={showAlert} />} />
					<Route path="/upload" element={<Upload getCookie={getCookie} showAlert={showAlert} />} />
					<Route path="/watch" element={<Watch getCookie={getCookie} subscribe={subscribe} 
													unsubscribe={unsubscribe} fetchVideoFunction={fetchVideo} showAlert={showAlert} />} />
					<Route path="/channel" element={<Channel getCookie={getCookie} subscribe={subscribe} unsubscribe={unsubscribe} />} />
					<Route path="/playlists" element={<Playlists showAlert={showAlert} />} />
					<Route path="/playlist" element={<ViewPlaylist showAlert={showAlert} />} />
					<Route path="/search" element={<Search getCookie={getCookie} showAlert={showAlert} />} />
				</Routes>
			</div>
		</>
	)
}

export default App;