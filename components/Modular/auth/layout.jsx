import React from 'react'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Image from 'next/image'
import Link from 'next/link'
import { Toaster } from "@/components/ui/toaster";


const AuthLayout = ({ title, description, children }) => {
    return (
        <>
            <Toaster />
            <main className="flex w-full h-screen justify-center items-center">
                <section className="flex flex-col gap-7 mt-5 justify-center items-center text-center">
                    <Card className="w-[310px]">
                        <CardHeader>
                            <div className="flex items-center justify-center">
                                <Link href={'/'} className="flex gap-2 justify-center items-center text-foreground">
                                    <Image
                                        src="/vercel.svg"
                                        alt="Sameframe Logo"
                                        width={30}
                                        height={30}
                                        priority
                                    />
                                </Link>
                            </div>
                            <CardTitle>{title}</CardTitle>
                            <CardDescription>{description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {children}
                        </CardContent>
                    </Card>
                </section>
            </main>
        </>
    )
}

export default AuthLayout
