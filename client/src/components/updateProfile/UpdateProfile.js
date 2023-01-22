import React from "react";
import "./UpdateProfile.scss";
import userImage from "../../assets/user.png";
function UpdateProfile() {
	return (
		<div className="UpdateProfile">
			<div className="container">
				<div className="left-part">
					<img className="user-image" src={userImage} alt="" />
				</div>
				<div className="right-part">
					<form action="">
						<input type="text" placeholder="Your Name" />
						<input type="text" placeholder="Bio" />
						<button type="submit" className="btn-primary">
							Submit
						</button>
					</form>
					<button className="btn-primary delete-account">
						Delete Account
					</button>
				</div>
			</div>
		</div>
	);
}

export default UpdateProfile;
