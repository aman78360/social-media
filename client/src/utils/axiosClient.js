import axios from "axios";
import {
	getItem,
	KEY_ACCESS_TOKEN,
	removeItem,
	setItem,
} from "./localStorageManager";
export const axiosClient = axios.create({
	baseURL: process.env.REACT_APP_SERVER_BASE_URL,
	withCredentials: true,
});

axiosClient.interceptors.request.use((request) => {
	const accessToken = getItem(KEY_ACCESS_TOKEN);
	request.headers["Authorization"] = `Bearer ${accessToken}`;
	return request;
});

axiosClient.interceptors.response.use(async (response) => {
	const data = response.data;
	if (data.status === "ok") {
		return data;
	}

	const orignalRequest = response.config;
	const statusCode = data.statusCode;
	const error = data.error;

	if (
		//when refresh token expires, send user to login page
		statusCode === 401 &&
		orignalRequest.url ===
			`${process.env.REACT_APP_SERVER_BASE_URL}/auth/refresh`
	) {
		removeItem(KEY_ACCESS_TOKEN);
		window.location.replace("/login", "_self");
		return Promise.reject(error);
	}

	if (statusCode === 401 && !orignalRequest._retry) {
		//means access token has expired
		orignalRequest._retry = true;
		const response = await axios
			.create({
				withCredentials: true,
			})
			.get(`${process.env.REACT_APP_SERVER_BASE_URL}/auth/refresh`);

		if (response.status === "ok") {
			setItem(KEY_ACCESS_TOKEN, response.result.accessToken);
			orignalRequest.headers[
				"Authorization"
			] = `Bearer ${response.result.accessToken}`;

			return axios(orignalRequest);
		}
	}

	return Promise.reject(error);
});
