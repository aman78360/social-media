import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { followAndUnfollowUser } from "../../redux/slices/feedSlice";
import Avatar from "../avatar/Avatar";
import "./Follower.scss";
function Follower({ user }) {
	const dispatch = useDispatch();
	const feedData = useSelector((state) => state.feedDataReducer.feedData);
	const navigate = useNavigate();
	const [isFollowing, setIsFollowing] = useState(false);

	useEffect(() => {
		setIsFollowing(
			feedData.followings.find((item) => item._id === user._id)
		);
	}, [isFollowing, feedData, user._id]);

	function handleUserFollow() {
		console.log("This is user id", user._id);
		dispatch(
			followAndUnfollowUser({
				userIdToFollow: user._id,
			})
		);
	}

	return (
		<div className="Follower">
			<div
				className="user-info"
				onClick={() => {
					navigate(`/profile/${user?._id}`);
				}}
			>
				<Avatar src={user?.avatar?.url} />
				<h4 className="name">{user?.name}</h4>
			</div>

			<h4
				onClick={handleUserFollow}
				className={
					isFollowing ? "hover-link follow-link" : "btn-primary"
				}
			>
				{isFollowing ? "Unfollow" : "Follow"}
			</h4>
		</div>
	);
}

export default Follower;
