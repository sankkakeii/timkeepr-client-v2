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
import { SignUpLogic } from "@/lib/business_logic/auth_logic/sign-up";
import { SocialSignUpLogic } from "@/lib/business_logic/auth_logic/social-sign-up";

// Define the form schema using Zod
const formSchema = z.object({
    userEmail: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6)
});

export function SignUp({ signUpOptions }) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userEmail: "",
            password: "",
            confirmPassword: ""
        }
    });

    const { toast } = useToast();
    const { signUpWithGoogle, signUpWithFacebook, signUpWithGithub } = SocialSignUpLogic();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { signUp } = SignUpLogic();


    // Handle form submission
    const handleSubmit = form.handleSubmit(async (values) => {
        // Check if passwords match
        if (values.password !== values.confirmPassword) {
            toast({ title: "Error", description: "Passwords do not match", variant: 'destructive' });
            return;
        }

        setLoading(true);
        const result = await signUp(values.userEmail, values.password);
        toast({ title: result.status.charAt(0).toUpperCase() + result.status.slice(1), description: result.message });
        if (result.status === 'success') {
            router.push('/auth/sign-in');
        }
        setLoading(false);
    });

    // Handle social sign up
    const handleSocialSignUp = async (signUpFunction, provider) => {
        try {
            const result = await signUpFunction();
            toast({ title: result.status.charAt(0).toUpperCase() + result.status.slice(1), description: result.message });
        } catch (error) {
            toast({ title: "Error", description: error.message, variant: 'destructive' });
        }
    };


    return (
        <div className="sign-up-container">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                    <div className="space-y-3 text-left">
                        <FormField
                            control={form.control}
                            name="userEmail"
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
                    <Button className="w-full" type="submit">Sign Up</Button>
                    {loading && <Spinner />}
                </form>

                <div className="relative my-5">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>

                <div className="space-y-3 text-white">
                    {signUpOptions.google && (
                        <Button
                            className="w-full bg-red-600"
                            variant="outline"
                            type="button"
                            onClick={() => handleSocialSignUp(signUpWithGoogle, 'Google')}
                        >
                            Google
                        </Button>
                    )}
                    {signUpOptions.facebook && (
                        <Button
                            className="w-full bg-blue-600"
                            variant="outline"
                            type="button"
                            onClick={() => handleSocialSignUp(signUpWithFacebook, 'Facebook')}
                        >
                            Facebook
                        </Button>
                    )}
                    {signUpOptions.github && (
                        <Button
                            className="w-full bg-black"
                            variant="outline"
                            type="button"
                            onClick={() => handleSocialSignUp(signUpWithGithub, 'Github')}
                        >
                            Github
                        </Button>
                    )}
                </div>

                <div className="py-3">
                    Already have an account?{' '} <span className="text-green-400 hover:underline"><a href="/auth/sign-in">Sign In</a></span>
                </div>
            </Form>
        </div>
    );
}
