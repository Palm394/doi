import axios from "axios";

const internal_http_client = axios.create({
	baseURL: import.meta.env.VITE_SERVICES_URL,
	headers: {
		"Content-type": "application/json",
	},
	withCredentials: true,
});

internal_http_client.interceptors.response.use(
	(res) => {
		if (res.data["success"] === false) {
			throw Promise.reject(res);
		}
		return res.data;
	},
	(error) => {
		if (error.status === 401) {
			return Promise.reject("Unauthorized");
		}
		if (error.response.data.message) {
			return Promise.reject(error.response.data.message);
		}
		if (error.message) {
			return Promise.reject(error.message);
		}
		return Promise.reject("An error occurred");
	}
);

export { internal_http_client };
