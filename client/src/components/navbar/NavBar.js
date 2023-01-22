import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "../avatar/Avatar";
import "./NavBar.scss";
import { FiLogOut } from "react-icons/fi";
import LoadingBar from "react-top-loading-bar";

function NavBar() {
	const navigate = useNavigate();
	const loadingRef = useRef();
	const [loading, setLoading] = useState(false);

	function toggleLoadingBar() {
		if (loading) {
			setLoading(false);
			loadingRef.current.complete();
		} else {
			setLoading(true);
			loadingRef.current.continuousStart();
		}
	}

	return (
		<div className="Navbar">
			<LoadingBar height={6} color="#458eff" ref={loadingRef} />
			<div className="container">
				<h2
					className="banner hover-link"
					onClick={() => {
						navigate("/");
					}}
				>
					Social Media
				</h2>
				<div className="right-side">
					<div
						className="profile hover-link"
						onClick={() => {
							navigate("/profile/asjfnk");
						}}
					>
						<Avatar />
					</div>

					<div
						className="logout hover-link"
						onClick={toggleLoadingBar}
					>
						<FiLogOut />
					</div>
				</div>
			</div>
		</div>
	);
}

export default NavBar;
