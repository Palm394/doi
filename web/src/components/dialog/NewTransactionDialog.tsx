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

import { useToast } from "@/hooks/use-toast"
import { getAccount } from "@/services/account"

type props = {
    parentRefresh: () => void
}

export default function NewTransactionDialog(props: props) {
    const [open, setOpen] = useState<boolean>(false)
    const [accountName, setAccountName] = useState<string | null>(null)
    const [avaliableAccounts, setAvaliableAccounts] = useState<any>([])
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
                    <div>
                        <Label>Account</Label>
                        <Select onValueChange={value => setAccountName(value)}>
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
                        <Label>Asset</Label>
                        <Input required />
                    </div>
                    <div>
                        <Label>Type</Label>
                        <Input required />
                    </div>
                    <div className="flex gap-6">
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
                    <div className="flex flex-row-reverse gap-2">
                        <Button className="w-fit mt-6">Create</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}