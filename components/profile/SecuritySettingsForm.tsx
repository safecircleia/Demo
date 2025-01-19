"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Shield, Key, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { useSession, signIn, signOut } from "next-auth/react";
import { startRegistration } from "@simplewebauthn/browser";
import { cn } from "@/lib/utils";

const SecuritySettingsForm = () => {
    const { data: session, update, status } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    useEffect(() => {
        console.debug("Session state:", {
            status,
            session,
            emailVerified: session?.user?.emailVerified
        });
    }, [status, session]);

    const sendVerificationEmail = async () => {
        setIsVerifying(true);
        try {
            const response = await fetch('/api/auth/email/verify-existing', {
                method: 'POST',
            });

            if (!response.ok) throw new Error();
            toast.success('Verification email sent! Please check your inbox.');
        } catch (error) {
            toast.error('Failed to send verification email');
        } finally {
            setIsVerifying(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user?.emailVerified) {
            toast.error("Please verify your email first");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            if (!res.ok) throw new Error();
            toast.success("Password updated successfully");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            // Sign out after password change
            await signOut({ redirect: true, callbackUrl: "/auth/login" });
        } catch (error) {
            toast.error("Failed to update password");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasskeyRegistration = async () => {
        // Prevent passkey registration in production
        if (process.env.NODE_ENV === 'production') {
            toast.error("Passkey support is coming soon!");
            return;
        }

        if (!session?.user?.emailVerified) {
            toast.error("Please verify your email first");
            return;
        }

        try {
            // Add CSRF token to the signIn call
            const result = await signIn("passkey", {
                action: "register",
                redirect: false,
                csrfToken: await fetch("/api/auth/csrf").then(r => r.json()).then(data => data.csrfToken)
            });

            if (result?.error) {
                toast.error(`Failed to add passkey: ${result.error}`);
                return;
            }

            toast.success("Passkey added successfully");
            await update();
        } catch (error) {
            console.error("Passkey registration error:", error);
            toast.error("Failed to add passkey");
        }
    };

    const toggleTwoFactor = async () => {
        if (!session?.user?.emailVerified) {
            toast.error("Please verify your email first");
            return;
        }

        try {
            const endpoint = twoFactorEnabled ? 'disable' : 'enable';
            const resp = await fetch(`/api/auth/2fa/${endpoint}`, {
                method: "POST",
            });

            if (!resp.ok) throw new Error();

            setTwoFactorEnabled(!twoFactorEnabled);
            toast.success(`2FA ${twoFactorEnabled ? 'disabled' : 'enabled'} successfully`);
        } catch (error) {
            toast.error("Failed to update 2FA settings");
        }
    };

    return (
        <Card className="backdrop-blur-sm bg-black/20 border-white/10">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Settings
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <h3 className="text-lg font-medium">Email Verification</h3>
                        <p className="text-sm text-gray-400">
                            {session?.user?.emailVerified
                                ? "Your email has been verified"
                                : "Verify your email to enable security features"}
                        </p>
                    </div>
                    <Button
                        onClick={sendVerificationEmail}
                        disabled={isVerifying || !!session?.user?.emailVerified}
                        className={cn(
                            "glass-button",
                            !!session?.user?.emailVerified && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <Mail className="h-4 w-4 mr-2" />
                        {isVerifying
                            ? "Sending..."
                            : !!session?.user?.emailVerified
                                ? "Verified"
                                : "Verify Email"}
                    </Button>
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <h3 className="text-lg font-medium">Passkeys</h3>
                        <p className="text-sm text-gray-400">
                            {process.env.NODE_ENV === 'production'
                                ? "Coming soon: Use your device's biometrics or PIN for faster login"
                                : "Use your device's biometrics or PIN for faster login"}
                        </p>
                    </div>
                    <Button
                        onClick={handlePasskeyRegistration}
                        disabled={!session?.user?.emailVerified || isLoading || process.env.NODE_ENV === 'production'}
                        className={cn(
                            "glass-button",
                            process.env.NODE_ENV === 'production' && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <Key className="h-4 w-4 mr-2" />
                        {process.env.NODE_ENV === 'production'
                            ? "Coming Soon"
                            : isLoading
                                ? "Adding..."
                                : "Add Passkey"}
                    </Button>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Change Password
                    </h3>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="current-password">Current Password</Label>
                            <Input
                                id="current-password"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="glass-input"
                                disabled={!session?.user?.emailVerified || isLoading}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="glass-input"
                                disabled={!session?.user?.emailVerified || isLoading}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="glass-input"
                                disabled={!session?.user?.emailVerified || isLoading}
                                required
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full glass-button"
                        disabled={!session?.user?.emailVerified || isLoading}
                    >
                        {isLoading ? "Updating..." : "Update Password"}
                    </Button>

                    {!session?.user?.emailVerified && (
                        <p className="text-sm text-yellow-500">
                            Please verify your email before changing your password
                        </p>
                    )}
                </form>
            </CardContent>
        </Card>
    );
};

export default SecuritySettingsForm;