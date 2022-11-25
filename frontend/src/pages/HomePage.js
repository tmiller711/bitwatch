import React from "react";
import { Link } from "react-router-dom";

const HomePage = (props) => {

	return (
		<>
			<h1>Homepage</h1>
			<Link to="/watch?v=be002872-dffe-4190-a6f6-e9fb46664b78">
				<p>test video</p>
			</Link>
		</>
	)
}

export default HomePage
