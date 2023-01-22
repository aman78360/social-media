import React from "react";
import userImage from "../../assets/user.png";
import "./Avatar.scss";
function Avatar({ src }) {
	return (
		<div className="Avatar">
			<img
				className="img"
				src={src ? src : userImage}
				alt="user avatar"
			/>
		</div>
	);
}

export default Avatar;
