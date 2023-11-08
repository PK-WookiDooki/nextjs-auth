"use client";
import {toast} from "react-hot-toast/headless";
import axios from "axios";
import {useRouter} from "next/navigation";
import {useState} from "react";
import Link from "next/link";
const ProfilePage = () => {
    const router = useRouter()

    const [currentUser, setCurrentUser] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const logout = async (e) => {
        e.preventDefault();
        try{
            await axios.get("/api/users/logout");
            toast.success("Logout successful!")
            router.push("/login")
        }catch(error){
            console.log("Logout failed", error.message);
            toast.error(error.message)
        }
    }

    const getUserDetail = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        const res = await axios.get("/api/users/me");
        console.log(res.data)
        if(res.data){
            setIsLoading(false)
        }
        setCurrentUser(res.data?.data)
    }

    return (
        <section className={` flex flex-col min-h-screen justify-center items-center `} >
            <h2 className={`mb-3`}>Profile page</h2>
            <h2 className={` text-yellow-500 `} > {currentUser === null ? "Unknown" : <Link href={`/profile/${currentUser?._id}`}> {currentUser?.username }</Link>  }</h2>

            <hr className={` bg-white w-full my-5`} />

            <div className={` flex gap-5`} >
                <button onClick={logout} className={` bg-red-600 hover:bg-red-500 base-btn `} >Logout</button>
                <button
                    disabled={isLoading}
                    onClick={getUserDetail} className={` bg-purple-600 hover:bg-purple-500 base-btn disabled:disabled-btn `} >Get User</button>
            </div>
        </section>
    );
};

export default ProfilePage;
