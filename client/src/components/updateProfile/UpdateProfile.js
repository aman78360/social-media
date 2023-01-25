import React, { useEffect, useState } from "react";
import "./UpdateProfile.scss";
import { useDispatch, useSelector } from "react-redux";
import { showToast, updateMyProfile } from "../../redux/slices/appConfigSlice";
import dummyUserPng from "../../assets/user.png";
import { axiosClient } from "../../utils/axiosClient";
import { useNavigate } from "react-router-dom";
import { KEY_ACCESS_TOKEN, removeItem } from "../../utils/localStorageManager";
import { TOAST_SUCCESS } from "../../App";

function UpdateProfile() {
	const myProfile = useSelector((state) => state.appConfigReducer.myProfile);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [bio, setBio] = useState("");
	const [userImage, setUserImage] = useState("");

	useEffect(() => {
		setName(myProfile?.name || ``);
		setBio(myProfile?.bio || ``);
		setUserImage(myProfile?.avatar?.url);
	}, [myProfile]);

	function handleImageChange(e) {
		const file = e.target.files[0];
		const fileReader = new FileReader();
		fileReader.readAsDataURL(file);
		fileReader.onload = () => {
			if (fileReader.readyState === fileReader.DONE) {
				setUserImage(fileReader.result);
				console.log("image data", fileReader.result);
			}
		};
	}

	async function handleDelete() {
		try {
			await axiosClient.delete("/user/");
			removeItem(KEY_ACCESS_TOKEN);
			navigate("/login");
			dispatch(
				showToast({
					type: TOAST_SUCCESS,
					message: "User Deleted Successfully",
				})
			);
		} catch (e) {
			console.log("this is delete error");
			console.log(e);
		}
	}

	function handleSubmit(e) {
		e.preventDefault();
		dispatch(
			updateMyProfile({
				name,
				bio,
				userImage,
			})
		);
	}

	return (
		<div className="UpdateProfile">
			<div className="container">
				<div className="left-part">
					<div className="input-user-image">
						<label htmlFor="inputImage" className="labelImage">
							<img
								src={userImage ? userImage : dummyUserPng}
								alt={name}
							/>
						</label>
						<input
							className="inputImage"
							id="inputImage"
							type="file"
							accept="image/*"
							onChange={handleImageChange}
						/>
					</div>
				</div>
				<div className="right-part">
					<form action="" onSubmit={handleSubmit}>
						<input
							value={name}
							type="text"
							placeholder="Your Name"
							onChange={(event) => {
								setName(event.target.value);
							}}
						/>
						<input
							value={bio}
							type="text"
							placeholder="Bio"
							onChange={(event) => {
								setBio(event.target.value);
							}}
						/>
						<button
							type="submit"
							className="btn-primary"
							onClick={handleSubmit}
						>
							Submit
						</button>
					</form>
					<button
						className="btn-primary delete-account"
						onClick={handleDelete}
					>
						Delete Account
					</button>
				</div>
			</div>
		</div>
	);
}

export default UpdateProfile;
