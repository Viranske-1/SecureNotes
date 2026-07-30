"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/api";


export default function RegisterPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [message, setMessage] = useState("");


    const handleRegister = async (e: React.FormEvent) => {

        e.preventDefault();

        try {

            const data = await apiRequest("/auth/register", {
                method: "POST",

                body: JSON.stringify({
                    email,
                    password
                }),
            });


            setMessage(data.message);


        } catch (error: any) {

            setMessage(error.message);

        }

    };


    return (

        <main className="flex min-h-screen items-center justify-center">

            <div className="w-full max-w-md rounded-lg border p-8">

                <h1 className="mb-6 text-3xl font-bold">
                    Create Account
                </h1>


                <form onSubmit={handleRegister} className="space-y-4">


                    <input

                        type="email"

                        placeholder="Email"

                        value={email}

                        onChange={(e) => setEmail(e.target.value)}

                        className="w-full rounded border p-3"

                        required

                    />


                    <input

                        type="password"

                        placeholder="Password"

                        value={password}

                        onChange={(e) => setPassword(e.target.value)}

                        className="w-full rounded border p-3"

                        required

                    />


                    <button

                        type="submit"

                        className="w-full rounded bg-black p-3 text-white"

                    >

                        Register

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