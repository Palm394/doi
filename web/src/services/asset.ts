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

export { getAssets };
