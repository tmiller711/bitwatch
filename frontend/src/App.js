import React, {useState} from "react";
import { render } from "react-dom";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import SideBar from "./components/sidebar/SideBar"
import HomePage from "./pages/homepage/HomePage"
import Subscriptions from "./pages/subscriptions/Subscriptions"
import History from "./pages/history/History"
import Login from "./pages/registration/Login"
import Register from "./pages/registration/Register"
import Upload from "./pages/Upload"
import Watch from "./pages/watch/Watch"
import Channel from "./pages/channel/Channel";
import Playlists from "./pages/Playlists";
import ViewPlaylist from "./pages/ViewPlaylist";
import Search from "./pages/Search";
import { Alert } from 'react-bootstrap';
// import "./css/sidebar.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import { PageNotFound } from "./components/notfound/NotFound";
import { subscribe, unsubscribe, fetchVideo, getCookie } from "./api/api"
import SendReset from "./pages/registration/SendReset";
import ResetPassword from "./pages/registration/ResetPassword";

function App() {
	const [alertShow, setAlertShow] = useState(false)
	const [alertText, setAlertText] = useState('')

	// function getCookie(name) {
    //     let cookieValue = null;
    //     if (document.cookie && document.cookie !== '') {
    //         const cookies = document.cookie.split(';');
    //         for (let i = 0; i < cookies.length; i++) {
    //             const cookie = cookies[i].trim();
    //             // Does this cookie string begin with the name we want?
    //             if (cookie.substring(0, name.length + 1) === (name + '=')) {
    //                 cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
    //                 break;
    //             }
    //         }
    //     }
    //     return cookieValue;
	// }

    // const fetchVideo = async (query) => {
    //     const csrftoken = getCookie('csrftoken')

    //     const res = await fetch(`/api/video/get/${query}`, {
    //         method: "POST",
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'X-CSRFToken': csrftoken
    //         },
    //     })
	// 	if (res.status == 200) {
	// 		const data = await res.json()
	// 		return data
	// 	} else if (res.status == 404) {
	// 		return 404
	// 	}
    // }

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
					<Route path="/login" element={<Login showAlert={showAlert} />} />
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
					<Route path='/sendreset' element={<SendReset showAlert={showAlert} getCookie={getCookie} />} />
					<Route path='/resetpassword' element={<ResetPassword showAlert={showAlert} getCookie={getCookie} />} />
					<Route component={<PageNotFound />} />
				</Routes>
			</div>
		</>
	)
}

export default App;