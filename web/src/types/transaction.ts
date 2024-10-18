type Transaction = {
	id: number;
	account_id: number;
	account: string;
	asset_id: string;
	asset: string;
	date: string;
	type: string;
	quantity: string;
	price_per_unit: number;
	fees: number;
	notes: string;
};

enum TransactionType {
	DEPOSIT = "deposit",
	WITHDRAW = "withdraw",
	BUY = "buy",
	SELL = "sell",
	DIVIDEND = "dividend",
	TRANSFER = "transfer",
	INTEREST = "interest",
	FEE = "fee",
	SPLIT = "split",
}

export type { Transaction };
export { TransactionType };
