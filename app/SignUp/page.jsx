"use client"

import Footer from '@/components/footer';
import Link from 'next/link';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSignUp = async (e) => {
        e.preventDefault();

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username }, // this stores it as user metadata
            },
        });

        if (error) {
            alert(error.message);
        } else {
            alert('Signup successful! Please check your email to verify your account.');
            router.push('/dashbord')
        }
    };


    const handleGoogleSignUp = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });

        if (error) {
            alert(error.message);
        }
    };

    const handleSendMagicLink = async () => {
        if (email) {
            const { error } = await supabase.auth.signInWithOtp({ email });
            if (error) {
                alert(error.message);
            } else {
                alert(`Magic link sent to ${email}`);
            }
        } else {
            alert('Please enter your email to send a magic link.');
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-10 rounded-lg shadow-xl">
                <div className="flex flex-col items-center">
                    <img
                        className="h-16 w-auto"
                        src="/logo.svg"
                        alt="Your App Logo"
                    />
                    <Link href={"/"}><h1 className="mt-4 text-3xl font-bold text-orange-400">MoneyMate</h1></Link>
                    <h2 className="mt-6 text-center text-3xl font-extrabold">
                        Sign Up
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Username
                            </label>
                            <input
                                id="Username"
                                name="Username"
                                type="text"
                                autoComplete="Username"
                                required
                                className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mt-px"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            onClick={handleGoogleSignUp}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>

                <div>
                    <button
                        onClick={handleGoogleSignUp}
                        type="button"
                        className="group relative w-full flex justify-center items-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-4"
                    >
                        <img
                            src="https://www.google.com/favicon.ico"
                            alt="Google icon"
                            className="w-5 h-5 mr-2"
                        />
                        Continue with Google
                    </button>
                </div>

                <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">Or</span>
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                </div>

                <div>
                    <button
                        onClick={handleSendMagicLink}
                        type="button"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Send Magic Link
                    </button>
                </div>

                <div className="text-sm text-center">
                    <Link href="/Signin" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Already have an account? Sign In
                    </Link>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default SignUp;
