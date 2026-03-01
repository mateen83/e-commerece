'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showRepeatPassword, setShowRepeatPassword] = useState(false)

    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter()
    const supabase = createClient()

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setMessage(null)

        if (password !== repeatPassword) {
            setError('Passwords do not match')
            return
        }

        setIsLoading(true)

        try {
            const { error } = await supabase.auth.updateUser({
                password: password,
            })

            if (error) throw error

            setMessage('Your password has been updated securely.')

            // Redirect after a short delay
            setTimeout(() => {
                router.push('/account')
            }, 2000)
        } catch (err: any) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Reset Password</CardTitle>
                            <CardDescription>
                                Enter your new password below.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdatePassword}>
                                <div className="flex flex-col gap-6">
                                    {/* New Password */}
                                    <div className="grid gap-2">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">New Password</Label>
                                        </div>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Repeat Password */}
                                    <div className="grid gap-2">
                                        <div className="flex items-center">
                                            <Label htmlFor="repeat-password">Confirm New Password</Label>
                                        </div>
                                        <div className="relative">
                                            <Input
                                                id="repeat-password"
                                                type={showRepeatPassword ? 'text' : 'password'}
                                                required
                                                value={repeatPassword}
                                                onChange={(e) => setRepeatPassword(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            >
                                                {showRepeatPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Messages */}
                                    {error && <p className="text-sm text-red-500">{error}</p>}
                                    {message && <p className="text-sm text-green-600 font-medium">{message}</p>}

                                    {/* Submit */}
                                    <Button type="submit" className="w-full" disabled={isLoading || !!message}>
                                        {isLoading ? 'Updating...' : 'Update Password'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
