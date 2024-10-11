import { useEffect, useState } from "react"
import { SubmitHandler, useForm, Controller } from "react-hook-form"

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
import { TransactionType } from "@/types/transaction"

type props = {
    parentRefresh: () => void
}

type FormInputs = {
    accountName: string
    date: Date
    asset: string
    transactionType: TransactionType
    shares: number
    pricePerShare: number
    fee: number
    amount: number
    notes: string
}

export default function NewTransactionDialog(props: props) {
    const [open, setOpen] = useState<boolean>(false)
    const [avaliableAccounts, setAvaliableAccounts] = useState<{ name: string, id: string }[]>([])

    const { register, formState: { errors }, handleSubmit, reset, control, watch } = useForm<FormInputs>()

    const { toast } = useToast()

    const onSubmit: SubmitHandler<FormInputs> = (data, event) => {
        event?.preventDefault()
        console.log(data)
        // toast({x`
        //     title: '',
        //     description: '',
        // })
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
        <Dialog open={open} onOpenChange={(open) => { setOpen(open); reset() }} modal>
            <DialogTrigger asChild>
                <Button>New</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Transaction</DialogTitle>
                    <DialogDescription>Fill in the form to create a new transaction</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 px-4">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Label htmlFor="accountName">Account<Label className="text-red-500">&nbsp;{errors.accountName?.message}</Label></Label>
                            <Controller
                                name="accountName"
                                rules={{ required: "This field is required" }}
                                control={control}
                                render={({ field }) =>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={watch("accountName") ?? "Select account"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {avaliableAccounts?.map((account) => (
                                                <SelectItem key={account.id} value={account.name}>{account.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                }
                            />
                        </div>
                        <div>
                            <Label>Date<Label className="text-red-500">&nbsp;{errors.date?.message}</Label></Label>
                            <Input type="datetime-local" {...register("date", { required: "This field is required", valueAsDate: true })} className="w-fit" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <Label>Type<Label className="text-red-500">&nbsp;{errors.transactionType?.message}</Label></Label>
                        <Controller
                            name="transactionType"
                            rules={{ required: "This field is required" }}
                            control={control}
                            render={({ field }) =>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.values(TransactionType).map((type) => (
                                            <SelectItem key={type} value={type}
                                                disabled={
                                                    type !== TransactionType.DEPOSIT &&
                                                    type !== TransactionType.WITHDRAW &&
                                                    type !== TransactionType.BUY &&
                                                    type !== TransactionType.SELL
                                                }
                                            >
                                                {type.charAt(0).toLocaleUpperCase() + type.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            }
                        />
                    </div>
                    <div className="flex-1">
                        <Label>Asset <Label className="text-red-500">{errors.asset?.message}</Label></Label>
                        <Input {...register("asset", { required: "This field is required" })} />
                    </div>
                    {(watch("transactionType") === TransactionType.BUY || watch("transactionType") === TransactionType.SELL) &&
                        <>
                            <div className="flex gap-4">
                                <div>
                                    <Label>Shares</Label>
                                    <Input {...register("shares", { required: "This field is required" })} />
                                    <Label className="text-red-500 text-xs">{errors.shares?.message}</Label>
                                </div>
                                <div>
                                    <Label>Price / Share</Label>
                                    <Input {...register("pricePerShare", { required: "This field is required" })} />
                                    <Label className="text-red-500 text-xs">{errors.pricePerShare?.message}</Label>
                                </div>
                                <div>
                                    <Label>Fee</Label>
                                    <Input {...register("fee", { required: "This field is required" })} />
                                    <Label className="text-red-500 text-xs">{errors.fee?.message}</Label>
                                </div>
                            </div>
                        </>
                    }
                    {(watch("transactionType") === TransactionType.DEPOSIT || watch("transactionType") === TransactionType.WITHDRAW) &&
                        <div>
                            <Label>Amount <Label className="text-red-500">&nbsp;{errors.amount?.message}</Label></Label>
                            <Input type="number" {...register("amount", { required: "This field is required", })} />
                        </div>
                    }
                    <div>
                        <Label>Notes</Label>
                        <Textarea {...register("notes")} />
                    </div>
                    <div className="flex flex-row-reverse gap-2">
                        <Button className="w-fit mt-6">Create</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}