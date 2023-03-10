import axios from "axios";
import {
	getItem,
	KEY_ACCESS_TOKEN,
	removeItem,
	setItem,
} from "./localStorageManager";
import store from "../redux/store";
import { setLoading, showToast } from "../redux/slices/appConfigSlice";
import { TOAST_FAILURE } from "../App";

let baseURL = "http://localhost:4001/";
console.log("env is", process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
	baseURL = process.env.REACT_APP_SERVER_BASE_URL;
}

export const axiosClient = axios.create({
	baseURL,
	withCredentials: true,
});

axiosClient.interceptors.request.use((request) => {
	const accessToken = getItem(KEY_ACCESS_TOKEN);
	request.headers["Authorization"] = `Bearer ${accessToken}`;
	store.dispatch(setLoading(true));
	return request;
});

axiosClient.interceptors.response.use(
	async (response) => {
		const data = response.data;
		if (data.status === "ok") {
			return data;
		}

		const orignalRequest = response.config;
		const statusCode = data.statusCode;
		const error = data.message;

		store.dispatch(
			showToast({
				type: TOAST_FAILURE,
				message: error,
			})
		);

		if (statusCode === 401 && !orignalRequest._retry) {
			//means access token has expired
			orignalRequest._retry = true;
			const response = await axios
				.create({
					withCredentials: true,
				})
				.get(`${baseURL}/auth/refresh`);

			if (response.status === "ok") {
				setItem(KEY_ACCESS_TOKEN, response.result.accessToken);
				orignalRequest.headers[
					"Authorization"
				] = `Bearer ${response.result.accessToken}`;

				return axios(orignalRequest);
			} else {
				removeItem(KEY_ACCESS_TOKEN);
				window.location.replace("/login", "_self");
				return Promise.reject(error);
			}
		}

		return Promise.reject(error);
	},
	async (error) => {
		store.dispatch(setLoading(false));
		store.dispatch(
			showToast({
				type: TOAST_FAILURE,
				message: error.message,
			})
		);
		return Promise.reject(error);
	}
);
