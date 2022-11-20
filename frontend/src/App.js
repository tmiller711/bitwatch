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
import "./css/sidenav.css"
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
	
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
					<Route path="/profile" element={<Profile />} />
				</Routes>
			</div>
		</>
	)
}

export default App;
