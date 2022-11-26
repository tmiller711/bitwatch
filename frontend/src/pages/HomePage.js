import React from "react";
import { Link } from "react-router-dom";

const HomePage = (props) => {

	return (
		<>
			<h1>Homepage</h1>
			<Link to="/watch?v=73a8b864-8ec1-4afb-825a-39e8d5cf1038">
				<p>test video</p>
			</Link>
		</>
	)
}

export default HomePage
