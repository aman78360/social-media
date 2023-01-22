import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";
export const getUserProfile = createAsyncThunk(
	"user/getUserProfile",
	async (body) => {
		try {
			const response = await axiosClient.post(
				"/user/getUserProfile",
				body
			);
			console.log("user profile response", response);
			return response.result;
		} catch (e) {
			console.log(e);
			return Promise.reject(e);
		}
	}
);

const postsSlice = createSlice({
	name: "postsSlice",
	initialState: {
		userProfile: {},
	},

	extraReducers: (builder) => {
		builder.addCase(getUserProfile.fulfilled, (state, action) => {
			state.userProfile = action.payload;
		});
	},
});

export default postsSlice.reducer;
