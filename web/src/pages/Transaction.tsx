import NewTransactionDialog from "@/components/dialog/NewTransactionDialog";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";

export default function Transaction() {
    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Transactions</h1>
                <NewTransactionDialog parentRefresh={() => { }} />
            </div>
            <Table className="bg-white rounded-xl">
                <TableHeader>
                    <TableRow className="bg-black hover:bg-current">
                        <TableHead className="text-white">ID</TableHead>
                        <TableHead className="text-white">Date</TableHead>
                        <TableHead className="text-white">Account</TableHead>
                        <TableHead className="text-white">Asset</TableHead>
                        <TableHead className="text-white">Type</TableHead>
                        <TableHead className="text-white">Shares</TableHead>
                        <TableHead className="text-white">Price/Share</TableHead>
                        <TableHead className="text-white">Value</TableHead>
                        <TableHead className="text-white">Fee</TableHead>
                        <TableHead />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>1</TableCell>
                        <TableCell>2021-09-01</TableCell>
                        <TableCell>Dime! USD</TableCell>
                        <TableCell>VOO</TableCell>
                        <TableCell>Buy</TableCell>
                        <TableCell>10</TableCell>
                        <TableCell>100</TableCell>
                        <TableCell>1000</TableCell>
                        <TableCell>0</TableCell>
                        <TableCell className="float-end">
                            <Button variant="ghost" className="h-8 w-8 p-2">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </>
    )
}