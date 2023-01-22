import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.scss";
import { axiosClient } from "../../utils/axiosClient";
import { KEY_ACCESS_TOKEN, setItem } from "../../utils/localStorageManager";
function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	async function handleSubmit(event) {
		event.preventDefault();
		try {
			const response = await axiosClient.post("/auth/login", {
				email,
				password,
			});

			setItem(KEY_ACCESS_TOKEN, response.result.accessToken);
			navigate("/");
		} catch (e) {
			console.log(e);
		}
	}

	return (
		<div className="Login">
			<div className="login-box">
				<h2 className="heading">Login</h2>
				<form onSubmit={handleSubmit}>
					<label htmlFor="email">Email</label>
					<input
						type="email"
						className="email"
						id="email"
						onChange={(event) => {
							setEmail(event.target.value);
						}}
					/>
					<label htmlFor="password">Password</label>
					<input
						type="password"
						className="password"
						id="password"
						onChange={(event) => {
							setPassword(event.target.value);
						}}
					/>
					<button
						type="submit"
						className="submit"
						onClick={handleSubmit}
					>
						Submit
					</button>
				</form>
				<p>
					Do not have an account? <Link to="/signup">Sign Up</Link>
				</p>
			</div>
		</div>
	);
}

export default Login;
