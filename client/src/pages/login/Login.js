import React, { useState } from "react";
import "./Login.scss";
import { Link, useNavigate } from "react-router-dom";

import { KEY_ACCESS_TOKEN, setItem } from "../../utils/localStorageManager";
import { axiosClient } from "../../utils/axiosClient";
import { useSelector } from "react-redux";

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const myProfile = useSelector((state) => state.appConfigReducer.myProfile);

	async function handleSubmit(event) {
		event.preventDefault();
		try {
			const response = await axiosClient.post("/auth/login", {
				email,
				password,
			});
			setItem(KEY_ACCESS_TOKEN, response?.result?.accessToken);
			navigate(`/${myProfile?._id}`);
		} catch (e) {
			console.log(e);
		}
	}

	return (
		<div className="Login">
			<div className="login_box">
				<h2 className="heading">Login</h2>
				<form onSubmit={handleSubmit}>
					<label htmlFor="email">Email</label>
					<input
						type="email"
						className="email"
						id="email"
						onChange={(e) => setEmail(e.target.value)}
					/>

					<label htmlFor="Password">Password</label>
					<input
						type="password"
						className="password"
						id="password"
						onChange={(e) => setPassword(e.target.value)}
					/>

					<input type="submit" className="submit" />
				</form>
				<p className="subheading">
					Do not have an account? <Link to="/signup">Signup</Link>
				</p>
			</div>
		</div>
	);
}

export default Login;
