'use client';

import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useRouter} from "next/navigation";
import {toast} from "react-hot-toast/headless";

const ForgotPasswordPage = () => {
    const router = useRouter()
    const [isDisabled, setIsDisabled] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("")

    useEffect(() => {
        if (email?.length > 0) {
            setIsDisabled(false)
        } else {
            setIsDisabled(true)
        }
    }, [email]);


    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const res = await axios.post("/api/users/forgotpassword", {email});
            toast.success(res.data?.data?.message)
            console.log(res.data?.message)
        } catch (error) {
            console.log(error?.response?.data?.error)
            toast.error(error.data?.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className={` flex flex-col min-h-screen w-full justify-center items-center `}>

            <div className={`form-style`}>
                <div className={` mb-8 text-center`}>
                    <h2 className={` form-tlt `}> Forgot Password ? </h2>
                    <p className={`text-sm text-gray-400 `}> Please enter your email address to reset the password! </p>
                </div>

                <form onSubmit={onSubmit}>
                    <div className={`input-group`}>
                        <label htmlFor={"email"}>Email</label>
                        <input id={'email'} type={"email"}
                               value={email}
                               onChange={(e) => setEmail(e.target.value)}
                               placeholder={"Enter your email address"}/>
                    </div>

                    <button
                        type={"submit"}
                        disabled={isDisabled || isLoading} className={` disabled:disabled-btn submit-btn `}>
                        {isLoading ? "Processing" : "Submit"}

                    </button>
                </form>
            </div>

        </section>
    );
};

export default ForgotPasswordPage;
