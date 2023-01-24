import React, { useEffect, useState } from "react";
import Post from "../post/Post";
import "./Profile.scss";
import { useNavigate, useParams } from "react-router-dom";
import CreatePost from "../createPost/CreatePost";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../../redux/slices/postsSlice";
import { followAndUnfollowUser } from "../../redux/slices/feedSlice";
import dummyUserPng from "../../assets/user.png";
function Profile() {
	const navigate = useNavigate();
	const params = useParams();
	const dispatch = useDispatch();
	const userProfile = useSelector((state) => state.postsReducer.userProfile);
	const myProfile = useSelector((state) => state.appConfigReducer.myProfile);
	const feedData = useSelector((state) => state.feedDataReducer.feedData);
	const [isMyProfile, setIsMyProfile] = useState(false);
	const [isFollowing, setIsFollowing] = useState(false);

	useEffect(() => {
		dispatch(
			getUserProfile({
				userId: params.userId,
			})
		);

		setIsMyProfile(myProfile?._id === params.userId);
		setIsFollowing(
			feedData?.followings?.find((item) => item._id === params.userId)
		);
	}, [myProfile, params.userId, feedData]);

	function handleUserFollow() {
		dispatch(
			followAndUnfollowUser({
				userIdToFollow: params.userId,
			})
		);
	}

	return (
		<div className="Profile">
			<div className="container">
				<div className="left-part">
					{isMyProfile && <CreatePost />}
					{userProfile?.posts?.map((item) => (
						<Post key={item._id} post={item} />
					))}
				</div>
				<div className="right-part">
					<div className="profile-card">
						<img
							className="user-image"
							src={
								userProfile?.avatar?.url
									? userProfile?.avatar?.url
									: dummyUserPng
							}
							alt=""
						/>
						<h3 className="user-name">{userProfile?.name}</h3>
						<p className="bio">{userProfile?.bio}</p>
						<div className="follower-info">
							<h4>{`${userProfile?.followers?.length} Followers`}</h4>
							<h4>
								{`${userProfile?.followings?.length} Followings`}
							</h4>
						</div>
						{!isMyProfile && (
							<h4
								style={{ marginTop: "10px" }}
								onClick={handleUserFollow}
								className={
									isFollowing
										? "hover-link follow-link"
										: "btn-primary"
								}
							>
								{isFollowing ? "Unfollow" : "Follow"}
							</h4>
						)}
						{isMyProfile && (
							<button
								className="update-profile btn-secondary"
								onClick={() => {
									navigate("/updateProfile");
								}}
							>
								Update Profile
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default Profile;
