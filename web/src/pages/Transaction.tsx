import { useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";

import NewTransactionDialog from "@/components/dialog/NewTransactionDialog";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

import { getTransactions } from "@/services/transaction";
import { Transaction as TransactionType } from "@/types/transaction";
import { Label } from "@/components/ui/label";

export default function Transaction() {
    const [transactions, setTransactions] = useState<TransactionType[]>([]);

    useEffect(() => {
        refresh();
    }, []);

    async function refresh() {
        const response = await getTransactions();
        if (response.success) {
            setTransactions(response.data || []);
        } else {
            console.error(response.message);
        }
    }

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Transactions</h1>
                <NewTransactionDialog parentRefresh={refresh} />
            </div>
            <Table className="bg-white rounded-xl">
                <TableHeader>
                    <TableRow className="bg-black hover:bg-current">
                        <TableHead className="text-white">Date</TableHead>
                        <TableHead className="text-white">Account</TableHead>
                        <TableHead className="text-white">Type</TableHead>
                        <TableHead className="text-white">Asset</TableHead>
                        <TableHead className="text-white text-end">Quantity</TableHead>
                        <TableHead />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((transaction) => {
                        const rowColor = transaction.type.toUpperCase() === "DEPOSIT" ? "text-green-500" : "text-red-500";
                        return (
                            <TableRow key={transaction.id}>
                                <TableCell>
                                    <Label className="block">{new Date(transaction.date).toLocaleDateString()}</Label>
                                    <Label className="text-xs text-neutral-500">{new Date(transaction.date).toLocaleTimeString()}</Label>
                                </TableCell>
                                <TableCell>{transaction.account}</TableCell>
                                <TableCell className={rowColor}>{transaction.type.toLocaleUpperCase()}</TableCell>
                                <TableCell>{transaction.asset.toUpperCase()}</TableCell>
                                <TableCell className="text-end">{Number(transaction.quantity).toFixed(2)}</TableCell>
                                <TableCell className="float-end">
                                    <Button variant="ghost" className="h-8 w-8 p-2">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </>
    )
}