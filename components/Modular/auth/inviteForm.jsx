// Import necessary modules from React
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/context/AuthUserContext';
import { useRouter } from 'next/router';
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from '@/components/ui/spinner';

// Zod schema definition for form validation
const formSchema = z.object({
    firstName: z.string().min(1, 'First Name is required'),
    lastName: z.string().min(1, 'Last Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z.string().min(6, 'Password must be at least 6 characters long'),
});

// Component for the Invite Sign Up Form
const InviteSignUpForm = () => {
    // useForm hook to manage form state and validation
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
        }
    });

    // Accessing toast functionality from useToast hook
    const { toast } = useToast();
    // Accessing createUserWithEmailAndPasswordInvite function from useAuth hook
    const { createUserWithEmailAndPasswordInvite } = useAuth();
    // State to track loading status during form submission
    const [loading, setLoading] = useState(false);
    // Accessing Next.js router functionality
    const router = useRouter();

    // useEffect to set default email value when router is ready
    useEffect(() => {
        if (router.isReady) {
            const { email } = router.query;
            form.setValue('email', email);
        }
    }, [router.isReady, router.query, form]);

    // Handle form submission
    const handleSubmit = form.handleSubmit(async (values) => {
        setLoading(true);

        // Check if passwords match
        if (values.password !== values.confirmPassword) {
            toast({ title: `Error`, description: `Passwords do not match`, variant: 'destructive' });
            setLoading(false);
            return;
        }

        try {
            // Attempt to create user with invite details
            await createUserWithEmailAndPasswordInvite(
                values.firstName,
                values.lastName,
                values.email,
                values.password,
                router.query.role,
                router.query.organizationId,
                router.query.invitedById
            );
            // Display success toast if user creation is successful
            toast({ title: `Success`, description: `User created successfully` });
            // Redirect to login page after successful user creation
            router.push('/auth/sign-in');
        } catch (error) {
            // Display error toast if there's an issue with user creation
            toast({ title: `Error`, description: error.message, variant: 'destructive' });
        } finally {
            // Set loading back to false after submission completes
            setLoading(false);
        }
    });

    // Render the Invite Sign Up Form component
    return (
        <div>
            {/* Form component wrapper */}
            <Form {...form}>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Form fields for name, email, password, and confirmPassword */}
                    <div className="space-y-3 text-left">
                        {/* Name input field */}
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="First Name" {...field} />
                                    </FormControl>
                                    <FormMessage>
                                        {form.formState.errors.firstName && <span className="text-red-500 text-xs italic">{form.formState.errors.firstName.message}</span>}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Last Name" {...field} />
                                    </FormControl>
                                    <FormMessage>
                                        {form.formState.errors.lastName && <span className="text-red-500 text-xs italic">{form.formState.errors.lastName.message}</span>}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />

                        {/* Email input field */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your email address" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Password input field */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Enter your password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Confirm Password input field */}
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Re-enter your password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Submit button and loading spinner */}
                    <Button className="w-full" type="submit" disabled={loading}>Sign Up</Button>
                    {loading && <Spinner />}
                </form>

                {/* Link to go home */}
                <div className="py-3 flex gap-3 justify-center items-center">
                    <span className="text-blue-400 hover:underline"><a href="/">Go Home</a></span>
                </div>
            </Form>
        </div>
    );
};

// Export the InviteSignUpForm component as the default export
export default InviteSignUpForm;
