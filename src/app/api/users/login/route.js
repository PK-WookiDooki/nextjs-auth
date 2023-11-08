import {dbConnect} from '@/dbConfig/dbConfig';
import User from "@/models/UserModel"
import {NextRequest, NextResponse} from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

dbConnect();

export async function POST(req){
    try {
        const reqBody = await req.json();
        const {email, password} = reqBody;

        //check if user exists or notd
        const user = await User.findOne({email})

        if(!user){
            return NextResponse.json({error : "User not found!"}, {status: 404})
        }

        // check if the password is correct or not
        const validPws = await bcrypt.compare(password, user.password)
        if(!validPws){
            return NextResponse.json({erorr : "Email or password is wrong!"}, {status : 400})
        }

        // create token data
        const tokenData = {
            id : user._id,
            username : user.username,
            email : user.email
        }

        const accessToken = await jwt.sign(tokenData, process.env.ACCESS_SECRET_TOKEN, {expiresIn: "1d"});

       const response = NextResponse.json({
            message : "Login successful!",
           success : true
        })

        response.cookies.set("token", accessToken, {httpOnly : true})

        return response;

    }catch (error){
        return NextResponse.json({error: error.message},{status: 500})
    }
}