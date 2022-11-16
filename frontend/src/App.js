import React from "react";
import { render } from "react-dom";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import SideNav from "./components/SideNav"
import HomePage from "./pages/HomePage"
import "./css/sidenav.css"

function App() {
	
	return (
		<>
			<SideNav/>
			<div className="content">
				<Routes>
					<Route path="/" element={<HomePage />} />
				</Routes>
			</div>
		</>
	)
}

export default App;
