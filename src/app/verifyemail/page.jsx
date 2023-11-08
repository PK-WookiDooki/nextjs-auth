"use client"
import {useEffect, useState} from 'react';
import axios from "axios";
import Link from "next/link";

const EmailVerificationPage = () => {

    const [token, setToken] = useState("")
    const [verified, setVerified] = useState(false)
    const [error, setError] = useState(false)

    const verifyUser = async () => {
        try {
            const res = await axios.post("/api/users/verifyemail", {token})
            setVerified(true)

        } catch (error) {
            setError(true)
            throw new Error(error.response.data)
        }
    }

    useEffect(() => {

        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken || "")
    }, []);


    useEffect(() => {
        if (token?.length > 0) {
            verifyUser()
        }
    }, [token])

    return (
        <section className={` flex flex-col min-h-screen w-full items-center justify-center`}>

            <h2 className={`text-2xl`}> Verify Email </h2>
            <p className={` p-2 mt-3 rounded-md bg-orange-400 text-white `}> {token ? token : "No Token"} </p>

            {
                verified && <div className={` mt-5 `}>
                    <h2 className={` text-xl font-medium `}> Email Verified Successfully! </h2>
                    <Link href={"/login"} className={` text-emerald-400`}> Login</Link>
                </div>
            }

            {
                error && <div className={` mt-5 `}>
                    <h2 className={` text-xl font-medium `}>Error! </h2>
                </div>
            }
        </section>
    );
};

export default EmailVerificationPage;
