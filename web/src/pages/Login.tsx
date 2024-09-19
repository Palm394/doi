import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from 'lucide-react'
import { login, verify } from '@/services/auth'
import { useToast } from '@/hooks/use-toast'

export default function Login() {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { toast } = useToast()
    const navigate = useNavigate();

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault()
        setIsLoading(true)
        const result = await login({ email, password })
        setIsLoading(false)
        if (!result.success) {
            return toast({
                title: 'Login failed',
                description: result.message,
                variant: 'destructive',
            })
        }
        navigate("/")
        return toast({
            title: 'Login Successful',
            description: result.message,
        })
    }

    useEffect(() => {
        async function check() {
            const isLogin = await verify();
            if (isLogin) {
                navigate("/");
            }
        }
        check();
    }, []);

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { id, value } = event.target
        if (id === 'email') {
            setEmail(value)
        }
        if (id === 'password') {
            setPassword(value)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={onSubmit}>
                <Card className="w-[350px]">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl">Login</CardTitle>
                        <CardDescription>
                            Enter your email and password to login
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="m@example.com" onChange={onChange} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" onChange={onChange} required />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" disabled={isLoading}>
                            {isLoading && (
                                <><Loader2 className="h-4 w-4 animate-spin" />&nbsp;</>
                            )}
                            Sign In
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    )
}