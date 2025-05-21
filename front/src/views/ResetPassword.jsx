import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axiosClient from "../axios";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [error, setError] = useState({ __html: '' });
    const [successMessage, setSuccessMessage] = useState('');

    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError({ __html: '' });
        setSuccessMessage('');

        try {
            await axiosClient.post("/reset-password", {
                token,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });

            setSuccessMessage("Password reset successful! You can now log in.");
            setPassword('');
            setPasswordConfirmation('');
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (error) {
            if (error.response) {
                const finalErrors = Object.values(error.response.data.errors || {}).reduce(
                    (accum, next) => [...accum, ...next],
                    []
                );
                setError({ __html: finalErrors.join('<br>') });
            }
        }
    };

    return (
        <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-theme-primary">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="text-center text-4xl font-bold leading-9 tracking-tight text-slate-100">
                    Reset Password
                </h2>
                {error.__html && (
                    <div
                        className="mt-4 bg-red-500 bg-opacity-80 rounded py-2 px-4 text-white text-sm"
                        dangerouslySetInnerHTML={error}
                    ></div>
                )}
                {successMessage && (
                    <div className="mt-4 bg-green-500 bg-opacity-80 rounded py-2 px-4 text-white text-sm text-center">
                        {successMessage}
                    </div>
                )}
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSubmit} className="max-w-md mx-auto text-white space-y-4">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="New Password"
                        className="font-bold block w-full bg-theme-secondary rounded-full border-0 outline-0 py-2 text-white placeholder:text-gray-400 sm:text-sm sm:leading-6 pl-8"
                    />
                    <input
                        type="password"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        placeholder="Confirm Password"
                        className="font-bold block w-full bg-theme-secondary rounded-full border-0 outline-0 py-2 text-white placeholder:text-gray-400 sm:text-sm sm:leading-6 pl-8"
                    />
                    <div className="flex justify-center pt-2">
                        <button
                            type="submit"
                            className="font-bold rounded-full px-10 py-1 pb-2 text-medium leading-6 text-white border-2 border-blue hover:text-primary-bg hover:bg-blue transition-colors duration-300"
                        >
                            Reset Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
