import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from 'next/router';
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";
import useFirebase from '@/lib/useFirebase';

// Define the form schema using Zod
const formSchema = z.object({
    email: z.string().email(),
});

export function ResetPassword() {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        }
    });

    const { toast } = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { sendPasswordResetEmail } = useFirebase();

    const handleSubmit = form.handleSubmit(async (values) => {
        setLoading(true);

        try {
            const result = await sendPasswordResetEmail(values.email);

            toast({
                title: result.status.charAt(0).toUpperCase() + result.status.slice(1),
                description: result.message,
            });

            if (result.status === 'success') {
                // Optionally, you can redirect the user to a different page after sending the reset email.
                // router.push('/reset-password-success');
            }
        } catch (error) {
            console.error(error);
            toast({
                title: 'Error',
                description: 'An error occurred while sending the password reset email.',
            });
        } finally {
            setLoading(false);
        }
    });

    return (
        <>
            <h1 className="p-3 text-xl font-bold">Reset Password</h1>
            <div className="border rounded-md p-6 lg:w-1/2 md:w-1/2 w-full">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                        <div className="space-y-3 text-left">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your email" type="email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button className="w-full" type="submit">
                            Reset Password
                        </Button>
                        {loading && <Spinner />}
                    </form>
                </Form>
            </div>
        </>
    );
}
