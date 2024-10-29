import { internal_http_client } from "./axios";

interface LoginRequest {
	email: string;
	password: string;
}

type LoginResponse = {
	success: boolean;
	message: string;
};

async function login(form: LoginRequest): Promise<LoginResponse> {
	if (form.email === "" || form.password === "") {
		return { success: false, message: "Email and password are required" };
	}
	try {
		await internal_http_client.post("/api/auth/login", form);
		return { success: true, message: "Login success" };
	} catch (error) {
		if (error === "Unauthorized") {
			return { success: false, message: "Invalid email or password" };
		}
		return { success: false, message: String(error) };
	}
}

async function verify(): Promise<boolean> {
	try {
		const response: { success: boolean } = await internal_http_client.get(
			"/api/auth/verify"
		);
		if (response.success === false) {
			throw Error("Unauthorized");
		}
		return true;
	} catch (error) {
		return false;
	}
}

async function logout(): Promise<boolean> {
	try {
		const response = await internal_http_client.post("/api/auth/logout");
		if (response.data["success"] === false) {
			throw Error(response.data["message"]);
		}
		return true;
	} catch (error) {
		return false;
	}
}

export { login, verify, logout };
