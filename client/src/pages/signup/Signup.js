import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { TOAST_SUCCESS } from "../../App";
import { showToast } from "../../redux/slices/appConfigSlice";
import { axiosClient } from "../../utils/axiosClient";
import "./Signup.scss";
function Signup() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const dispatch = useDispatch();
	const navigate = useNavigate();
	async function handleSubmit(event) {
		event.preventDefault();
		try {
			const result = await axiosClient.post("/auth/signup", {
				name,
				email,
				password,
			});
			dispatch(
				showToast({
					type: TOAST_SUCCESS,
					message: "User Created  Successfully",
				})
			);
			navigate("/login");
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
