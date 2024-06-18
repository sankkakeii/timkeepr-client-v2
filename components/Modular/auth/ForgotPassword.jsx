// Import necessary modules from React
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/context/AuthUserContext';
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";

// Zod schema definition for form validation
const formSchema = z.object({
    email: z.string().email(),
});

// Component for the Forgot Password Form
const ForgotPasswordForm = () => {
    // useForm hook to manage form state and validation
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        }
    });

    // Accessing toast functionality from useToast hook
    const { toast } = useToast();
    // Accessing sendPasswordResetEmail function from useAuth hook
    const { sendPasswordResetEmail } = useAuth();
    // State to track loading status during form submission
    const [loading, setLoading] = useState(false);

    // Handle form submission
    const handleSubmit = form.handleSubmit(async (values) => {
        setLoading(true);
        try {
            // Attempt to send password reset email
            await sendPasswordResetEmail(values.email);
            // Display success toast if successful
            toast({ title: `Success`, description: `Password reset email sent successfully!` });
        } catch (error) {
            // Display error toast if there's an issue
            toast({ title: `Error`, description: `Error sending email`, variant: 'destructive' });
        } finally {
            // Set loading back to false after submission completes
            setLoading(false);
        }
    });

    // Render the Forgot Password Form component
    return (
        <div>
            {/* Form component wrapper */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                    {/* Email input field */}
                    <div className="space-y-3 text-left">
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
                    </div>
                    {/* Submit button and loading spinner */}
                    <Button className="w-full" type="submit" disabled={loading}>Reset Password</Button>
                    {loading && <Spinner />}
                </form>

                {/* Links to go back and go home */}
                <div className="py-3 flex gap-3 justify-center items-center">
                    <span className="text-blue-400 hover:underline"><a href="/auth/sign-in">Go Back</a></span>
                    <span className="text-green-400 hover:underline"><a href="/">Go Home</a></span>
                </div>
            </Form>
        </div>
    );
};

// Export the ForgotPasswordForm component as the default export
export default ForgotPasswordForm;
