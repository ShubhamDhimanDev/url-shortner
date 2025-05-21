import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../axios";

export default function ForgotPassword() {

    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axiosClient.post("/send-reset-password-link", { email });
            alert("Reset link sent to your email.");
        } catch (err) {
            console.error(err);
            alert("Error sending reset link.");
        }
    };

    return (
        <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-theme-primary">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                {/* <a href="/">
                  <img
                    className="mx-auto h-10 w-auto"
                    // src={logo}
                    alt="iD"
                  />
                </a> */}
                <h2 className="text-center text-4xl font-bold leading-9 tracking-tight text-slate-100">
                    Forgot Password
                </h2>
                {/*  {error.__html && (
                  <div
                    className="mt-2 bg-red-500 rounded py-2 px-3 text-white"
                    dangerouslySetInnerHTML={error}
                  ></div>
                )} */}
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-xl font-medium leading-6 text-white"
                        >
                            Your email:
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                required
                                className="font-bold block w-full bg-theme-secondary rounded-full border-0 outline-0 py-1.5 text-white placeholder:text-gray-400 sm:text-sm sm:leading-6 pl-8"
                            />
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="font-bold rounded-full px-10 py-1 pb-2 text-medium leading-6 text-white border-2 border-blue hover:text-primary-bg hover:bg-blue transition-colors duration-300"
                        >
                            Send reset link
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Not registered yet?{' '}
                    <Link
                        className="font-semibold text-lg leading-6 text-white hover:text-primary-bg"
                        to="/register"
                    >
                        Sign Up
                    </Link>
                </p>
                <p className="mt-1 text-center text-sm text-gray-500">
                    Already have account?{' '}
                    <Link
                        className="font-semibold text-lg leading-6 text-white hover:text-primary-bg"
                        to="/login"
                    >
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    )
}