import React, { useState } from "react";
import { Link } from "react-router-dom";
import { axiosClient } from "../../utils/axiosClient";
import "./Signup.scss";
function Signup() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	async function handleSubmit(event) {
		event.preventDefault();
		try {
			const result = await axiosClient.post("/auth/signup", {
				name,
				email,
				password,
			});
			console.log(result);
		} catch (error) {
			console.log(error);
		}
	}
	return (
		<div className="Signup">
			<div className="Signup-box">
				<h2 className="heading">Signup</h2>
				<form onSubmit={handleSubmit}>
					<label htmlFor="name">Name</label>
					<input
						type="text"
						className="name"
						id="name"
						onChange={(event) => {
							setName(event.target.value);
						}}
					/>

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

					<input type="submit" className="submit" />
				</form>
				<p>
					Already have an account? <Link to="/login">Login</Link>
				</p>
			</div>
		</div>
	);
}

export default Signup;
