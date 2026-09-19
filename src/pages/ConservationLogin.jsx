import React, { useState, useEffect } from 'react';
import { signIn, confirmSignIn, getCurrentUser } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, LockKeyhole, Mail, ArrowRight } from 'lucide-react';

export default function ConservationLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [requiresNewPassword, setRequiresNewPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
        try {
            const user = await getCurrentUser();

            console.log('Existing Cognito session found:', user);

            if (mounted) {
                navigate('/dashboard', { replace: true });
            }
        } catch (err) {
            console.log('No existing Cognito session');

            if (mounted) {
                setCheckingSession(false);
            }
        }
    };

    checkSession();

    return () => {
        mounted = false;
    };
}, [navigate]);

    const handleLogin = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError('');

    try {
        const result = await signIn({
            username: email.trim(),
            password,
        });

        console.log('Cognito signIn result:', result);
        console.log('isSignedIn:', result.isSignedIn);
        console.log('nextStep:', result.nextStep);

        if (result.isSignedIn === true) {
            console.log('Login successful — navigating to dashboard');

            navigate('/dashboard', { replace: true });
            return;
        }

        if (
            result.nextStep?.signInStep ===
            'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED'
        ) {
            console.log('New password required');

            setRequiresNewPassword(true);
            return;
        }

        console.log('Unhandled Cognito sign-in step:', result.nextStep);

    } catch (err) {
        console.error('Conservation team login failed:', err);

        setError(
            err?.message ||
            'Unable to sign in. Please check your conservation team credentials.'
        );
    } finally {
        setLoading(false);
    }
};

    const handleSetNewPassword = async (event) => {
        event.preventDefault();

        if (!newPassword) {
            setError('Please enter a new password.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await confirmSignIn({
                challengeResponse: newPassword,
            });

            console.log('Cognito confirmSignIn result:', result);

            if (result.isSignedIn) {
                console.log('Login successful — navigating to dashboard');
                navigate('/dashboard', { replace: true });
                return;
            } else {
                console.log('Additional Cognito step required:', result.nextStep);
            }
        } catch (err) {
            console.error('Password change failed:', err);

            setError(
                err?.message ||
                'Unable to set the new password. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
    <div className="min-h-[75vh] flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
            <div className="bg-white border border-[#D8CDBD] rounded-3xl shadow-xl overflow-hidden">

                {/* Header */}
                <div className="bg-stone-900 px-8 py-8 text-center">
                    <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-[#C5A059]/15 border border-[#C5A059]/40 flex items-center justify-center">
                        <ShieldCheck
                            size={28}
                            className="text-[#D7B56D]"
                        />
                    </div>

                    <h1 className="text-2xl font-semibold text-[#F5EFE6]">
                        Conservation Team
                    </h1>

                    <p className="mt-2 text-sm text-stone-300">
                        Secure access to the DigiVirasat monitoring dashboard
                    </p>
                </div>

                <div className="p-8">

                    {checkingSession ? (
                        <div className="py-10 text-center">
                            <div className="mx-auto mb-4 h-8 w-8 rounded-full border-2 border-[#C5A059] border-t-transparent animate-spin" />

                            <p className="text-sm text-stone-600">
                                Checking secure session...
                            </p>
                        </div>
                    ) : !requiresNewPassword ? (

                        <form onSubmit={handleLogin} className="space-y-5">

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-2">
                                    Conservation team email
                                </label>

                                <div className="relative">
                                    <Mail
                                        size={17}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                                    />

                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="conservation@example.com"
                                        required
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 bg-[#FBF8F2] text-sm outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-2">
                                    Password
                                </label>

                                <div className="relative">
                                    <LockKeyhole
                                        size={17}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                                    />

                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        required
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 bg-[#FBF8F2] text-sm outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#996515] text-[#16120E] font-bold text-sm transition-all hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    'Signing in...'
                                ) : (
                                    <>
                                        <span>Access Dashboard</span>
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>

                        </form>

                    ) : (

                        <form
                            onSubmit={handleSetNewPassword}
                            className="space-y-5"
                        >

                            <div>
                                <h2 className="text-lg font-semibold text-stone-900">
                                    Set your permanent password
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-stone-600">
                                    This is your first sign-in. Create a new password
                                    for your Conservation Team account.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-2">
                                    New password
                                </label>

                                <div className="relative">
                                    <LockKeyhole
                                        size={17}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                                    />

                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Create a new password"
                                        required
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 bg-[#FBF8F2] text-sm outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#996515] text-[#16120E] font-bold text-sm transition-all hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading
                                    ? 'Updating password...'
                                    : 'Set Password & Continue'}
                            </button>

                        </form>
                    )}

                </div>
            </div>
        </div>
    </div>
);
}