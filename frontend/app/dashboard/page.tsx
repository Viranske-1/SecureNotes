"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Notes from "@/components/Notes";


export default function DashboardPage() {

    const router = useRouter();


    useEffect(() => {

        const token = localStorage.getItem("token");


        if (!token) {
            router.push("/login");
        }

    }, [router]);


    const logout = () => {

        localStorage.removeItem("token");

        router.push("/login");

    };


    return (

        <main className="min-h-screen p-10">

            <div className="flex justify-between items-center">

                <h1 className="text-3xl font-bold">
                    SecureNotes Dashboard
                </h1>


                <button

                    onClick={logout}

                    className="rounded bg-black px-5 py-2 text-white"

                >
                    Logout
                </button>


            </div>


            <div className="mt-10 rounded border p-6">

                <h2 className="text-xl font-semibold">
                    Welcome to SecureNotes 🔐
                </h2>


                <p className="mt-3">
                    Your encrypted notes will appear here.
                </p>


            </div>
            <Notes />


        </main>

    );

}