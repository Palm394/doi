import axios from "axios";

const internal_http_client = axios.create({
	baseURL: import.meta.env.VITE_SERVICES_URL,
	headers: {
		"Content-type": "application/json",
	},
	withCredentials: true,
});

internal_http_client.interceptors.response.use(
	(response) => {
		if (response.status === 401) {
			throw Error("Unauthorized");
		}
		return response;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export { internal_http_client };
