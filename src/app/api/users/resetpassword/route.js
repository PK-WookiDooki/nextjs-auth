import {NextResponse} from "next/server";
import {dbConnect} from "@/dbConfig/dbConfig";
import User from "@/models/UserModel";
import bcrypt from "bcryptjs";

dbConnect()

export async function POST(req) {
    try {
        const reqBody = await req.json();
        const {token, password} = reqBody;
        console.log(token)

        const user = await User.findOne({forgotPasswordToken: token, forgotPasswordTokenExpiry: {$gt: Date.now()}});

        if (!user) {
            return NextResponse.json({error: "Invalid Token!"}, {status: 400})
        }

        //     hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;
        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined;
        await user.save();

        return NextResponse.json({
            message: "Password reset successfully!",
            success: true
        })


    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}