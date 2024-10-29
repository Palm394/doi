import { Transaction } from "@/types/transaction";
import { internal_http_client } from "./axios";

type getTransactionsResponse = {
	success: boolean;
	data?: Transaction[];
	message?: string;
};

async function getTransactions(): Promise<getTransactionsResponse> {
	try {
		const response = await internal_http_client.get("/api/transaction");
		return { success: true, data: response.data };
	} catch (error: any) {
		return { success: false, message: error };
	}
}

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

type deleteTransactionResponse = {
	success: boolean;
	message?: string;
};

async function deleteTransaction(
	transactionID: number
): Promise<deleteTransactionResponse> {
	try {
		await internal_http_client.delete(`/api/transaction/${transactionID}`);
		return { success: true };
	} catch (error) {
		console.error(error);
		return { success: false, message: String(error) };
	}
}

export type { createTransactionParams };
export { getTransactions, createTransaction, deleteTransaction };
