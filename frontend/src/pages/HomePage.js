import React from "react";
import { Link } from "react-router-dom";

const HomePage = (props) => {

	return (
		<>
			<h1>Homepage</h1>
			<Link to="/watch?v=78f0d57b-494e-47c9-babf-54dfbda7051e">
				<p>test video</p>
			</Link>
		</>
	)
}

export default HomePage
