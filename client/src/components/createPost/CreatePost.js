import React, { useState } from "react";
import Avatar from "../avatar/Avatar";
import { BsCardImage } from "react-icons/bs";
import "./CreatePost.scss";
import { axiosClient } from "../../utils/axiosClient";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../../redux/slices/postsSlice";
function CreatePost() {
	const [postImage, setPostImage] = useState("");
	const [caption, setCaption] = useState("");
	const dispatch = useDispatch();
	const myProfile = useSelector((state) => state.appConfigReducer.myProfile);

	function handleImageChange(e) {
		const file = e.target.files[0];
		const fileReader = new FileReader();
		fileReader.readAsDataURL(file);
		fileReader.onload = () => {
			if (fileReader.readyState === fileReader.DONE) {
				setPostImage(fileReader.result);
				console.log("image data", fileReader.result);
			}
		};
	}

	async function handlePostSubmit() {
		try {
			const result = await axiosClient.post("/posts", {
				caption,
				postImage,
			});
			console.log("post done", result);

			dispatch(
				getUserProfile({
					userId: myProfile?._id,
				})
			);
		} catch (e) {
			console.log("error related to post submit", e);
		} finally {
			setCaption("");
			setPostImage("");
		}
	}

	return (
		<div className="CreatePost">
			<div className="left-part">
				<Avatar className="user-avatar" src={myProfile?.avatar?.url} />
			</div>
			<div className="right-part">
				<input
					value={caption}
					type="text"
					className="captionInput"
					placeholder="What's on your mind"
					onChange={(e) => setCaption(e.target.value)}
				/>
				{postImage && (
					<div className="image-container">
						<img className="postImage" src={postImage} alt="" />
					</div>
				)}

				<div className="bottom-part">
					<div className="input-post-image">
						<label htmlFor="inputImage" className="labelImage">
							<BsCardImage />
						</label>
						<input
							className="inputImage"
							id="inputImage"
							type="file"
							accept="image/*"
							onChange={handleImageChange}
						/>
					</div>
					<button
						className="post-btn btn-primary"
						onClick={handlePostSubmit}
					>
						Post
					</button>
				</div>
			</div>
		</div>
	);
}

export default CreatePost;
