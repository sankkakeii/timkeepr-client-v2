import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";
import useFirebase from '@/lib/useFirebase';
import { useAuth } from "@/context/AuthUserContext";

// Define the form schema using Zod
const formSchema = z.object({
    newEmail: z.string().email(),
    password: z.string(),
});

export function UpdateEmail() {

    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const { changeEmail } = useFirebase();
    const { authUser } = useAuth();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            newEmail: `${authUser.data.email}`,
            password: "",
        }
    });

    const handleSubmit = form.handleSubmit(async (values) => {
        setLoading(true);

        try {
            const result = await changeEmail(authUser.data.email, values.newEmail, values.password);

            toast({
                title: result.status.charAt(0).toUpperCase() + result.status.slice(1),
                description: result.message,
            });

            if (result.status === 'success') {
                // Additional success actions
            }
        } catch (error) {
            console.error(error);
            toast({
                title: 'Error',
                description: 'An error occurred while changing email.',
            });
        } finally {
            setLoading(false);
        }
    });

    return (
        <>
            <h1 className="p-3 text-xl font-bold">Change Email</h1>
            <div className="border rounded-md p-6 lg:w-1/2 md:w-1/2 w-full">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                        <div className="space-y-3 text-left">
                            <FormField
                                control={form.control}
                                name="newEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your new email" type="email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your password" type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button className="w-full" type="submit">
                            Change Email
                        </Button>
                        {loading && <Spinner />}
                    </form>
                </Form>
            </div>
        </>
    );
}
