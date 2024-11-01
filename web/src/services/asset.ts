import { internal_http_client } from "./axios";

type getAssetResponse = {
	success: boolean;
	data?: any;
	message?: string;
};

async function getAssets(): Promise<getAssetResponse> {
	try {
		const response = await internal_http_client.get("/api/asset");
		return { success: true, data: response.data };
	} catch (error: any) {
		return { success: false, message: error };
	}
}

type getAllCashAccountResponse = {
	success: boolean;
	data: {
		sum: string;
		cash_accounts: Array<{
			name: string;
			current_value_thb: string;
		}>;
	};
	message?: string;
};

async function getAllCashAccount(): Promise<getAllCashAccountResponse> {
	try {
		const response = await internal_http_client.get("/api/asset/cash_account");
		return { success: true, data: response.data };
	} catch (error: any) {
		return {
			success: false,
			message: error,
			data: { sum: "0", cash_accounts: [] },
		};
	}
}

export type { getAllCashAccountResponse };
export { getAssets, getAllCashAccount };
