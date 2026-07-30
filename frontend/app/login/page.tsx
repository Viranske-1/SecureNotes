"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";


export default function LoginPage() {

    const router = useRouter();


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [message, setMessage] = useState("");


    const handleLogin = async (e: React.FormEvent) => {

        e.preventDefault();


        try {

            const data = await apiRequest("/auth/login", {

                method: "POST",

                body: JSON.stringify({
                    email,
                    password
                }),

            });


            localStorage.setItem(
                "token",
                data.token
            );


            setMessage("Login successful");


            router.push("/dashboard");


        } catch (error: any) {

            setMessage(error.message);

        }

    };


    return (

        <main className="flex min-h-screen items-center justify-center">


            <div className="w-full max-w-md rounded-lg border p-8">


                <h1 className="mb-6 text-3xl font-bold">
                    Login
                </h1>


                <form 
                    onSubmit={handleLogin}
                    className="space-y-4"
                >


                    <input

                        type="email"

                        placeholder="Email"

                        value={email}

                        onChange={(e) =>
                            setEmail(e.target.value)
                        }

                        className="w-full rounded border p-3"

                        required

                    />


                    <input

                        type="password"

                        placeholder="Password"

                        value={password}

                        onChange={(e) =>
                            setPassword(e.target.value)
                        }

                        className="w-full rounded border p-3"

                        required

                    />


                    <button

                        type="submit"

                        className="w-full rounded bg-black p-3 text-white"

                    >

                        Login

                    </button>


                </form>


                {message && (

                    <p className="mt-4">
                        {message}
                    </p>

                )}


            </div>


        </main>

    );

}