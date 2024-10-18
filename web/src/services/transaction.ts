import { internal_http_client } from "./axios";

type createTransactionParams = {
	accountID: number;
	assetID: string;
	date: Date;
	transactionType: string;
	quantity: number;
	price_per_unit: number;
	fees: number;
	notes: string;
};

type createTransactionResponse = {
	success: boolean;
	data?: any;
	message?: string;
};

async function createTransaction(
	params: createTransactionParams
): Promise<createTransactionResponse> {
	try {
		const response = await internal_http_client.post(
			"/api/transaction",
			params
		);
		return { success: true, data: response.data };
	} catch (error: any) {
		return { success: false, message: error };
	}
}

export type { createTransactionParams };
export { createTransaction };
