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
import { getAssets } from "@/services/asset"
import { TransactionType } from "@/types/transaction"
import { createTransaction, createTransactionParams } from "@/services/transaction"

type props = {
    parentRefresh: () => void
}

export default function NewTransactionDialog(props: props) {
    const [open, setOpen] = useState<boolean>(false)
    const [avaliableAccounts, setAvaliableAccounts] = useState<{ name: string, id: number }[]>([])
    const [avaliableAssets, setAvaliableAssets] = useState<{ name: string, id: string }[]>()

    const { register, formState: { errors }, handleSubmit, reset, control, watch } = useForm<createTransactionParams>()

    const { toast } = useToast()

    const onSubmit: SubmitHandler<createTransactionParams> = async (data, event) => {
        event?.preventDefault()
        const response = await createTransaction(data)
        if (response.success === false) {
            return toast({
                title: 'Create Transaction Failed',
                description: response.message,
                variant: 'destructive',
            })
        }
        setOpen(false)
        props.parentRefresh()
        return toast({
            title: 'Transaction Created',
            description: 'Transaction has been created successfully',
        })
    }

    useEffect(() => {
        refresh()
    }, [])

    async function refresh() {
        const [accounts, assets] = await Promise.all([getAccount(), getAssets()])
        if (accounts.success === false || !accounts.data) {
            return toast({
                title: 'Get Account Failed',
                description: accounts.message,
                variant: 'destructive',
            })
        }
        setAvaliableAccounts(accounts.data)
        if (assets.success === false || !assets.data) {
            return toast({
                title: 'Get Assets Failed',
                description: assets.message,
                variant: 'destructive',
            })
        }
        setAvaliableAssets(assets.data)
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
                            <Label htmlFor="accountID">Account<Label className="text-red-500">&nbsp;{errors.accountID?.message}</Label></Label>
                            <Controller
                                name="accountID"
                                rules={{ required: "This field is required" }}
                                control={control}
                                render={({ field }) =>
                                    <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={"Select account"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {avaliableAccounts.map((account) => (
                                                <SelectItem key={account.id} value={account.id.toString()}>{account.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                }
                            />
                        </div>
                        <div>
                            <Label>Date<Label className="text-red-500">&nbsp;{errors.date?.message}</Label></Label>
                            <Input type="datetime-local" step={1} {...register("date", { required: "This field is required", valueAsDate: true })} className="w-fit" />
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
                                                    type !== TransactionType.WITHDRAW
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
                        <Label>Asset<Label className="text-red-500">&nbsp;{errors.assetID?.message}</Label></Label>
                        {avaliableAssets &&
                            <Controller
                                name="assetID"
                                defaultValue={avaliableAssets[0].id}
                                rules={{ required: "This field is required" }}
                                control={control}
                                render={({ field }) =>
                                    <Select onValueChange={field.onChange} {...field}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select asset" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {avaliableAssets.map(({ id, name }) => (
                                                <SelectItem key={id} value={id}>{name.toUpperCase()}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                }
                            />
                        }
                    </div>
                    {(watch("transactionType") === TransactionType.BUY || watch("transactionType") === TransactionType.SELL) &&
                        <>
                            <div className="flex gap-4">
                                <div>
                                    <Label>Shares</Label>
                                    <Input type="number" {...register("quantity", { required: "This field is required" })} />
                                    <Label className="text-red-500 text-xs">{errors.quantity?.message}</Label>
                                </div>
                                <div>
                                    <Label>Price / Share</Label>
                                    <Input {...register("price_per_unit", { required: "This field is required" })} />
                                    <Label className="text-red-500 text-xs">{errors.price_per_unit?.message}</Label>
                                </div>
                                <div>
                                    <Label>Fee</Label>
                                    <Input {...register("fees", { required: "This field is required" })} />
                                    <Label className="text-red-500 text-xs">{errors.fees?.message}</Label>
                                </div>
                            </div>
                        </>
                    }
                    {(watch("transactionType") === TransactionType.DEPOSIT || watch("transactionType") === TransactionType.WITHDRAW) &&
                        <div>
                            <Label>Amount <Label className="text-red-500">&nbsp;{errors.quantity?.message}</Label></Label>
                            <Input {...register("quantity", { required: "This field is required", valueAsNumber: true })} />
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