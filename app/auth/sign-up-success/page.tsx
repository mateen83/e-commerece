import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'

export default function SignUpSuccessPage() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Check your email</CardTitle>
                        <CardDescription>
                            We&apos;ve sent you a confirmation link
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        <div className="text-sm text-muted-foreground text-center">
                            Please check your inbox to verify your email address to complete your registration.
                        </div>
                        <Button asChild className="w-full">
                            <Link href="/auth/login">Return to login</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
