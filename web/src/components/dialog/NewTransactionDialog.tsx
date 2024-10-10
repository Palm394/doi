import { useEffect, useState } from "react"

import {
    Dialog,
    DialogDescription,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

import { useToast } from "@/hooks/use-toast"
import { getAccount } from "@/services/account"

type props = {
    parentRefresh: () => void
}

export default function NewTransactionDialog(props: props) {
    const [open, setOpen] = useState<boolean>(false)
    const [accountName, setAccountName] = useState<string | null>(null)
    const [avaliableAccounts, setAvaliableAccounts] = useState<any>([])
    const [date, setDate] = useState<Date>()
    const [asset, setAsset] = useState<string>()
    const [type, setType] = useState<string>()
    const [shares, setShares] = useState<number>()
    const [pricePerShare, setPricePerShare] = useState<number>()
    const [fee, setFee] = useState<number>()
    const [notes, setNotes] = useState<string>()

    const { toast } = useToast()

    async function submit(event: React.SyntheticEvent) {
        event.preventDefault()
        toast({
            title: '',
            description: '',
        })
        props.parentRefresh()
    }

    useEffect(() => {
        refresh()
    }, [])

    async function refresh() {
        const response = await getAccount()
        if (response.success === false || !response.data) {
            return toast({
                title: 'Get Account Failed',
                description: response.message,
                variant: 'destructive',
            })
        }
        setAvaliableAccounts(response.data)
    }

    return (
        <Dialog open={open} onOpenChange={(open) => { setAccountName(null); setOpen(open); }}>
            <DialogTrigger asChild>
                <Button>New</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Transaction</DialogTitle>
                    <DialogDescription>Fill in the form to create a new transaction</DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="flex flex-col gap-4 px-4">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Label>Account</Label>
                            <Select onValueChange={value => setAccountName(value)} required>
                                <SelectTrigger>
                                    <SelectValue placeholder={accountName ?? "Select account"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {avaliableAccounts?.map((account: any) => (
                                        <SelectItem key={account.id} value={account.name}>{account.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Date</Label>
                            <Input type="datetime-local" required className="w-fit" />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Label>Asset</Label>
                            <Input required />
                        </div>
                        <div className="flex-1">
                            <Label>Type</Label>
                            <Select required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="buy">Buy</SelectItem>
                                    <SelectItem value="sell">Sell</SelectItem>
                                    <SelectItem value="dividend" disabled>Dividend</SelectItem>
                                    <SelectItem value="transfer" disabled>Transfer</SelectItem>
                                    <SelectItem value="deposit" disabled>Deposit</SelectItem>
                                    <SelectItem value="withdraw" disabled>Withdraw</SelectItem>
                                    <SelectItem value="interest" disabled>Interest</SelectItem>
                                    <SelectItem value="fee" disabled>Fee</SelectItem>
                                    <SelectItem value="split" disabled>Split</SelectItem>
                                    <SelectItem value="rebalance" disabled>Rebalance</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div>
                            <Label>Shares</Label>
                            <Input required />
                        </div>
                        <div>
                            <Label>Price/Share</Label>
                            <Input required />
                        </div>
                        <div>
                            <Label>Fee</Label>
                            <Input required />
                        </div>
                    </div>
                    <div>
                        <Label>Notes</Label>
                        <Textarea />
                    </div>
                    <div className="flex flex-row-reverse gap-2">
                        <Button className="w-fit mt-6">Create</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}