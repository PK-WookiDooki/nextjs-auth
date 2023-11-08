"use client";

import {useRouter} from "next/navigation";
import axios from "axios";
import {useEffect, useState} from "react";
import {toast} from "react-hot-toast/headless";


const ResetPasswordPage = () => {
    const router = useRouter()
    const [user, setUser] = useState({
        password_confirmation: "",
        password: "",
    })
    const [isDisabled, setIsDisabled] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [token, setToken] = useState("")
    const [error, setError] = useState(null)

    const [isCPVisible, setIsCPVisible] = useState(false)

    useEffect(() => {
        if (error !== null) {
            setTimeout(() => {
                setError(null)
            }, 5000)
        }
    }, [error]);

    useEffect(() => {
        const urlToken = window.location.search?.split("=")[1]
        setToken(urlToken || "")
    }, [])

    useEffect(() => {
        if (user.password_confirmation.length > 0 && user.password.length > 0) {
            setIsDisabled(false)
        } else {
            setIsDisabled(true)
        }
    }, [user]);


    const onPasswordReset = async (e) => {
        e.preventDefault()
        try {
            setIsLoading(true)

            if (
                user.password_confirmation !== user.password
            ) {
                setError("Password confirmation doesn't match!")
                setIsLoading(false)
                return
            }

            if (token?.length < 1) {
                setError("Invalid Token!");
                setIsLoading(false)
                return;
            }

            const res = await axios.post("/api/users/resetpassword", {password: user.password, token});
            toast.success("Password reset success!")
            router.push('/login')
        } catch (error) {
            console.log("Password reset failed", error.message)
            console.log(error)
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const onChange = (e) => {
        setUser({...user, [e.target.name]: e.target.value})
    }

    return (
        <section className={` flex min-h-screen w-full items-center justify-center flex-col `}>
            <div className={` form-style `}>
                <div className={`mb-8 text-center`}>
                    <h2 className={`form-tlt`}>
                        Create New Password
                    </h2>
                </div>

                {error !== null && <p className={`error-alert`}> {error} </p>}

                <form onSubmit={onPasswordReset}>

                    <div className={'input-group'}>
                        <label htmlFor={"password"}> Password </label>
                        <div className={` w-full relative`}>
                            <input type={isVisible ? "text" : "password"} id={'password'} value={user.password}
                                   name={"password"} onChange={onChange} placeholder={'Enter your password'}
                                   className={`w-full `}/>

                            <button type={'button'}
                                    onClick={() => setIsVisible(!isVisible)}
                                    className={`pws-toggle`}> {isVisible ? 'HIDE' : 'SHOW'} </button>
                        </div>
                    </div>
                    <div className={'input-group'}>
                        <label htmlFor={"password_confirmation"}> Confirm Password </label>
                        <div className={`relative`}>
                            <input type={isCPVisible ? "text" : "password"} id={'password_confirmation'}
                                   value={user.password_confirmation} name={"password_confirmation"} onChange={onChange}
                                   placeholder={'Please confirm your password'} className={"w-full"}/>
                            <button type={'button'}
                                    onClick={() => setIsCPVisible(!isCPVisible)}
                                    className={`pws-toggle`}> {isCPVisible ? 'HIDE' : 'SHOW'} </button>
                        </div>
                    </div>
                    <button type={"submit"} disabled={isDisabled || isLoading}
                            className={` disabled:disabled-btn submit-btn `}>
                        {isLoading ? "Processing" : "Confirm"}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default ResetPasswordPage;
