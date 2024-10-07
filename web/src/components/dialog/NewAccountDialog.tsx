import { useState } from "react"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { createAccount } from "@/services/account"
import { useToast } from "@/hooks/use-toast"

type NewAccountDialogProps = {
    parentRefresh: () => void
}

export default function NewAccountDialog(props: NewAccountDialogProps) {
    const [open, setOpen] = useState<boolean>(false)
    const [accountName, setAccountName] = useState<string>('')
    const [nation, setNation] = useState<string>('')
    const { toast } = useToast()

    async function submit(event: React.SyntheticEvent) {
        event.preventDefault()
        const response = await createAccount({ name: accountName, nation: nation })
        if (response.success === false) {
            return toast({
                title: 'Create Account Failed',
                description: response.message,
                variant: 'destructive',
            })
        }
        setOpen(false)
        toast({
            title: 'Create Account Successful',
            description: response.message,
        })
        props.parentRefresh()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>New</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Account</DialogTitle>
                </DialogHeader>
                <form onSubmit={submit} className="flex flex-col gap-4 px-4">
                    <div>
                        <Label>Name</Label>
                        <Input onChange={e => setAccountName(e.target.value)} required />
                    </div>
                    <div>
                        <Label>Nation</Label>
                        <Input onChange={e => setNation(e.target.value)} required />
                    </div>
                    <div className="flex flex-row-reverse gap-2">
                        <Button className="w-fit mt-6">Create</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}