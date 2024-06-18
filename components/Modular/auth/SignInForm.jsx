// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { useForm } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import React, { useState } from 'react';
// import { useToast } from "@/components/ui/use-toast";
// import { Spinner } from "@/components/ui/spinner";
// import { SignInLogic } from "@/lib/business_logic/auth_logic/sign-in";
// import { SocialSignInLogic } from "@/lib/business_logic/auth_logic/social-sign-in";
// import { UserLogic } from "@/lib/business_logic/user_logic/user-logic";
// import { useRouter } from 'next/router';
// import { db } from "@/lib/firebase";
// import globalConfig from "@/globalConfig";




// // Define the form schema using Zod
// const formSchema = z.object({
//     userEmail: z.string().email(),
//     password: z.string().min(6),
// });

// export function SignIn({ signUpOptions }) {
//     const form = useForm({
//         resolver: zodResolver(formSchema),
//         defaultValues: {
//             userEmail: "",
//             password: ""
//         }
//     });

//     const { toast } = useToast();
//     const { signIn } = SignInLogic();
//     const [loading, setLoading] = useState(false);
//     const { signInWithGoogle, signInWithFacebook, signInWithGithub } = SocialSignInLogic();
//     const userLogic = UserLogic();
//     const router = useRouter();

//     // Define function to handle form submission
//     const handleSubmit = form.handleSubmit(async (values) => {
//         setLoading(true);
//         try {
//             const result = await signIn(values.userEmail, values.password);
//             toast({ title: result.status.charAt(0).toUpperCase() + result.status.slice(1), description: result.message });
//         } finally {
//             setLoading(false);
//         }
//     });

//     // Handle social sign in
//     const handleSocialSignIn = async (signInFunction, provider) => {
//         try {
//             const result = await signInFunction();
//             let authUser = result.data.authUser;
//             let userProfile = await userLogic.getUserById(result.data.authUser.data.uid);

//             // Check if the user is signing in for the first time
//             if (userProfile.isNewUser == true) {
//                 // Update isNewUser to false before routing to the onboarding page
//                 await db.collection(globalConfig.firestoreCollections.users).doc(authUser.data.uid).update({
//                     isNewUser: false
//                 });

//                 // Redirect the user based on their role and first-time sign-in status
//                 if (userProfile.role.key === 'superuser' || userProfile.role.key === 'admin') {
//                     // Route new admins to admin-onboarding
//                     router.push('/admin-onboarding');
//                 } else if (userProfile.role.key === 'user') {
//                     router.push('/user-onboarding');
//                 }
//             } else if (userProfile.isNewUser == false) {

//                 // Redirect the user based on their role and first-time sign-in status
//                 if (userProfile.role.key === 'superuser' || userProfile.role.key === 'admin') {
//                     // Route new admins to admin-onboarding
//                     router.push('/_admin/dashboard');
//                 } else if (userProfile.role.key === 'user') {
//                     router.push(`/_profile/${authUser.data.uid}`);
//                 }
//             };
//             toast({ title: result.status.charAt(0).toUpperCase() + result.status.slice(1), description: result.message });

//         } catch (error) {
//             toast({ title: "Error", description: error.message, variant: 'destructive' });
//         }
//     };

//     return (
//         <div className="sign-in-container">
//             <Form {...form}>
//                 <form onSubmit={form.handleSubmit(handleSubmit)} className="form-container space-y-5">
//                     <div className="input-section space-y-3 text-left">
//                         <FormField
//                             control={form.control}
//                             name="userEmail"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Email</FormLabel>
//                                     <FormControl>
//                                         <Input placeholder="Enter your email address" {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                         <FormField
//                             control={form.control}
//                             name="password"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Password</FormLabel>
//                                     <FormControl>
//                                         <Input type="password" placeholder="Enter your password" {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                     </div>
//                     <Button className="submit-button w-full" type="submit">Sign In</Button>
//                     {loading && <Spinner />}
//                 </form>

//                 <div className="social-sign-in-separator relative my-5">
//                     <div className="absolute inset-0 flex items-center">
//                         <span className="w-full border-t" />
//                     </div>
//                     <div className="relative flex justify-center text-xs uppercase">
//                         <span className="bg-background px-2 text-muted-foreground">
//                             Or continue with
//                         </span>
//                     </div>
//                 </div>

//                 <div className="social-buttons-section space-y-3 text-white">
//                     {signUpOptions.google && (
//                         <Button
//                             className="google-sign-in-button w-full bg-red-600"
//                             variant="outline"
//                             type="button"
//                             onClick={() => handleSocialSignIn(signInWithGoogle, 'Google')}
//                         >
//                             Google
//                         </Button>
//                     )}
//                     {signUpOptions.facebook && (
//                         <Button
//                             className="facebook-sign-in-button w-full bg-blue-600"
//                             variant="outline"
//                             type="button"
//                             onClick={() => handleSocialSignIn(signInWithFacebook, 'Facebook')}
//                         >
//                             Facebook
//                         </Button>
//                     )}
//                     {signUpOptions.github && (
//                         <Button
//                             className="github-sign-in-button w-full bg-black"
//                             variant="outline"
//                             type="button"
//                             onClick={() => handleSocialSignIn(signInWithGithub, 'Github')}
//                         >
//                             Github
//                         </Button>
//                     )}
//                 </div>

//                 <div className="sign-up-link-section pt-6">
//                     Don't have an account? <span className="sign-up-link text-green-400 hover:underline"><a href="/auth/sign-up">Sign Up</a></span>
//                 </div>

//                 <div className="forgot-password-section py-3">
//                     Forgot Password? <span className="forgot-password-link text-blue-400 hover:underline"><a href="/auth/forgot-password">Click Here</a></span>
//                 </div>
//             </Form>
//         </div>
//     );
// }













import { useState, useEffect } from 'react';
import Spinner from '@/components/ui/spinner';


export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        localStorage.setItem('time-token', token);
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading state to true when form is submitted

        try {
            const res = await fetch(`/api/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (res.status === 401) {
                setError('Unauthorized access. Please check your credentials');
                setLoading(false); // Set loading state to false after response is received
                return;
            }

            const data = await res.json();

            if (data.auth) {
                setToken(data.token);
                window.location.href = '/clock-in';
            } else {
                setError('Something went wrong. Please try again');
                setLoading(false); // Set loading state to false after response is received
            }
        } catch (error) {
            setError('An error occurred. Please try again');
            setLoading(false); // Set loading state to false after response is received
        }
    };

    return (
        <main className="h-screen flex items-center w-full justify-center bg-gray-50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
            <div className="relative rounded-xl shadow-2xl overflow-hidden w-full max-w-md">
                <div className="flex flex-col items-center justify-center py-8 px-6 bg-white sm:rounded-3xl sm:p-20">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Timekeepr</h2>
                    <div className="text-gray-600 text-center mb-6">
                        <h1 className="text-xl font-semibold">Welcome back!</h1>
                        <p>Sign in to access your account</p>
                    </div>
                    <form className="w-full" onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Your email</label>
                            <input type="email" name="email" id="email" className="border border-gray-300 rounded-lg focus:border-green-500 w-full px-4 py-2" placeholder="name@company.com" required="" value={email} onChange={e => setEmail(e.target.value)} />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    id="password"
                                    className="border border-gray-300 rounded-lg focus:border-green-500 w-full px-4 py-2 pr-10"
                                    placeholder="••••••••"
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                >
                                    <svg className="h-5 w-5 text-gray-700" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
                                    </svg>

                                </button>
                            </div>
                        </div>


                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <input id="remember" type="checkbox" className="mr-2 cursor-pointer" />
                                <label htmlFor="remember" className="text-sm text-gray-500">Remember me</label>
                            </div>
                            <a href="#" className="text-sm text-green-500 hover:underline">Forgot password?</a>
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                        <button type="submit" className="bg-green-500 hover:bg-green-700 w-full rounded-lg text-white font-medium py-2">
                            {loading ? <Spinner /> : 'Sign in'}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    )
}
