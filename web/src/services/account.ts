import { internal_http_client } from "./axios";

type getAccountResponse = {
	success: boolean;
	data?: any;
	message?: string;
};

async function getAccount(): Promise<getAccountResponse> {
	try {
		const response = await internal_http_client.get("/api/account");
		return { success: true, data: response.data.data };
	} catch (error) {
		return {
			success: false,
			message: error ? String(error) : "An error occurred",
		};
	}
}

type createAccountRequest = {
	name: string;
	nation: string;
};

type createAccountResponse = {
	success: boolean;
	data?: any;
	message?: string;
};

async function createAccount(
	data: createAccountRequest
): Promise<createAccountResponse> {
	try {
		const response = await internal_http_client.post("/api/account", {
			name: data.name,
			region: data.nation,
		});
		return { success: true, data: response.data };
	} catch (error: any) {
		return { success: false, message: error };
	}
}

async function deleteAccount(id: number): Promise<any> {
	try {
		await internal_http_client.delete(`/api/account/${id}`);
		return { success: true, message: "Account deleted" };
	} catch (error) {
		return { success: false, message: error };
	}
}

export { getAccount, createAccount, deleteAccount };
