import React, { useState } from 'react';
import { MedkitIcon } from './icons/Icons';

interface AuthProps {
    onLogin: (email: string, password: string) => boolean;
    onRegister: (email: string, password: string) => boolean;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onRegister }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoginView) {
            onLogin(email, password);
        } else {
            if (password !== confirmPassword) {
                alert("Passwords do not match.");
                return;
            }
            if(onRegister(email, password)) {
                setIsLoginView(true);
                setEmail('');
                setPassword('');
                setConfirmPassword('');
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#C6EBC5] flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <MedkitIcon className="h-12 w-12 text-[#3A7D44] mx-auto" />
                    <h1 className="mt-3 text-4xl font-extrabold text-[#344F1F] font-lora">Digital Rx Platform</h1>
                    <p className="mt-2 text-base text-[#344F1F]/80">
                        {isLoginView ? 'Sign in to your account' : 'Create a new account'}
                    </p>
                </div>

                <div className="bg-[#EAF6E6] p-8 rounded-2xl shadow-lg border border-[#3A7D44]/20">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="text-sm font-medium text-[#344F1F]">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#3A7D44] focus:border-[#3A7D44]"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="text-sm font-medium text-[#344F1F]">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete={isLoginView ? "current-password" : "new-password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#3A7D44] focus:border-[#3A7D44]"
                            />
                        </div>

                        {!isLoginView && (
                            <div>
                                <label htmlFor="confirm-password" className="text-sm font-medium text-[#344F1F]">Confirm Password</label>
                                <input
                                    id="confirm-password"
                                    name="confirm-password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#3A7D44] focus:border-[#3A7D44]"
                                />
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-[#F4991A] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F4991A]"
                            >
                                {isLoginView ? 'Sign In' : 'Register'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setIsLoginView(!isLoginView)}
                            className="text-sm font-medium text-[#3A7D44] hover:text-opacity-80"
                        >
                            {isLoginView ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                        </button>
                    </div>
                </div>
                 <p className="mt-4 text-center text-xs text-gray-500">
                    Note: The first registered user will be an admin.
                </p>
            </div>
        </div>
    );
};

export default Auth;