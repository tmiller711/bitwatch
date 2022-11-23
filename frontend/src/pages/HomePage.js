import React from "react";
import { Link } from "react-router-dom";

const HomePage = (props) => {

	return (
		<>
			<h1>Homepage</h1>
			<Link to="/watch?v=b6adf0a9-1fd5-409f-bfb8-f5fd895601fc">
				<p>test video</p>
			</Link>
		</>
	)
}

export default HomePage
