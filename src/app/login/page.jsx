"use client";

import Link from "next/link"
import {useRouter} from "next/navigation";
import axios from "axios";
import {useEffect, useState} from "react";
import {toast} from "react-hot-toast/headless";


const LoginPage = () => {
    const router = useRouter()
    const [user, setUser] = useState({
        email: "",
        password: "",
    })
    const [isDisabled, setIsDisabled] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [errMsg, setErrMsg] = useState(null)

    useEffect(() => {
        if (errMsg !== null) {
            setTimeout(() => {
                setErrMsg(null)
            }, 5000)
        }
    }, [errMsg])

    useEffect(() => {
        if (user.email.length > 0 && user.password.length > 0) {
            setIsDisabled(false)
        } else {
            setIsDisabled(true)
        }
    }, [user]);


    const onLogin = async (e) => {
        e.preventDefault()
        try {
            setIsLoading(true)
            const res = await axios.post("/api/users/login", user);
            console.log("Login success", res.data);
            toast.success("Login success!")
            router.push('/profile')
        } catch (error) {
            console.log("Login failed", error.message)
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
                        Login
                    </h2>
                    <p> Don&apos;t have an account?
                        <Link href={'/signup'} className={`text-emerald-400`}> Signup </Link>
                    </p>
                </div>

                {errMsg !== null && <p className={` error-alert `}> {errMsg} </p>}

                <form onSubmit={onLogin}>
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

                    <Link href={'/forgotpassword'}
                          className={` text-blue-400 hover:text-blue-500 duration-300 `}> Forgot Password
                        ? </Link>

                    <button type={"submit"} disabled={isDisabled || isLoading}
                            className={` disabled:disabled-btn submit-btn `}>
                        {isLoading ? "Processing" : "Login"}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default LoginPage;
