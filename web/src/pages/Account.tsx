import { useEffect, useState } from "react"
import { MoreHorizontal } from "lucide-react"

import NewAccountDialog from "@/components/dialog/NewAccountDialog"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"

import { AccountHead } from "@/types/account"

import { getAccount, deleteAccount } from "@/services/account"

export default function Account() {
    const [accounts, setAccounts] = useState<AccountHead[]>([])

    useEffect(() => {
        refresh()
    }, [])

    async function refresh() {
        const response = await getAccount()
        if (response.success === false || !response.data) {
            return
        }
        setAccounts(response.data)
    }

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Account</h1>
                <NewAccountDialog parentRefresh={refresh} />
            </div>
            <Table className="bg-white rounded-xl">
                <TableHeader>
                    <TableRow className="bg-black hover:bg-current">
                        <TableHead className="text-white text-center">ID</TableHead>
                        <TableHead className="text-white">Name</TableHead>
                        <TableHead className="text-white">Nation</TableHead>
                        <TableHead />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {accounts.map((account) => (
                        <TableRow key={account.id}>
                            <TableCell className="text-center">{account.id}</TableCell>
                            <TableCell>{account.name}</TableCell>
                            <TableCell>{account.region}</TableCell>
                            <TableCell className="float-end">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-2">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem disabled>
                                            Edit Account
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-600"
                                            onClick={
                                                async () => {
                                                    await deleteAccount(account.id)
                                                    refresh()
                                                }
                                            }
                                        >
                                            Delete Account
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}