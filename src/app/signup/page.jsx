"use client";

import Link from "next/link"
import {useRouter} from "next/navigation";
import axios from "axios";
import {useEffect, useState} from "react";
import {toast} from "react-hot-toast/headless";


const SignupPage = () => {

    const router = useRouter();

    const [user, setUser] = useState({
        email: "",
        password: "",
        username: ""
    })
    const [isVisible, setIsVisible] = useState(false)
    const [isDisabled, setIsDisabled] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [errMsg, setErrMsg] = useState(null)

    useEffect(() => {
        if (errMsg !== null) {
            setTimeout(() => {
                setErrMsg(null)
            }, 5000)
        }
    }, [errMsg])

    const onSignUp = async (e) => {
        e.preventDefault()
        try {
            setIsLoading(true)
            const res = await axios.post("/api/users/signup", user);

            console.log("Signup success", res.data)
            router.push("/login")

        } catch (error) {
            console.log("Signup failed", error.message)
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (user.email.length > 0 && user.password.length > 0 && user.username.length > 0) {
            setIsDisabled(false)
        } else {
            setIsDisabled(true)
        }
    }, [user])

    const onChange = (e) => {
        setUser({...user, [e.target.name]: e.target.value})
    }

    return (
        <section className={` flex min-h-screen w-full items-center justify-center `}>
            <div className={` max-w-md w-full rounded-md bg-slate-900 shadow shadow-amber-50 p-5 `}>
                <div className={`mb-8 text-center`}>
                    <h2 className={`form-tlt`}>
                        Sign Up
                    </h2>
                    <p>Already have an account?
                        <Link href={'/login'} className={`text-emerald-400`}> Login </Link>
                    </p>
                </div>

                {errMsg !== null && <p className={` error-alert `}> {errMsg} </p>}

                <form onSubmit={onSignUp}>
                    <div className={'input-group'}>
                        <label htmlFor={"username"}> Username </label>
                        <input type={'text'} id={'username'} value={user.username} name={"username"} onChange={onChange}
                               placeholder={'Enter your name'}
                        />
                    </div>
                    <div className={'input-group'}>
                        <label htmlFor={"email"}> Email </label>
                        <input type={'email'} id={'email'} value={user.email} name={"email"} onChange={onChange}
                               placeholder={'Enter your email address'}/>
                    </div>
                    <div className={'input-group'}>
                        <label htmlFor={"password"}> Password </label>
                        <div className={` w-full relative`}>
                            <input type={isVisible ? "text" : "password"} id={'password'} value={user.password}
                                   name={"password"} onChange={onChange} placeholder={'Enter your password'}
                                   className={`w-full`}/>

                            <button type={'button'}
                                    onClick={() => setIsVisible(!isVisible)}
                                    className={`pws-toggle`}> {isVisible ? 'HIDE' : 'SHOW'} </button>
                        </div>
                    </div>

                    <button disabled={isDisabled || isLoading} type={"submit"}
                            className={` disabled:disabled-btn submit-btn `}>
                        {isLoading ? "Processing" : "Sign Up"} </button>
                </form>
            </div>
        </section>
    );
};

export default SignupPage;
