import {NextResponse} from "next/server";
import {dbConnect} from "@/dbConfig/dbConfig";
import User from "@/models/UserModel";
import {sendEmail} from "@/helpers/mailer";

dbConnect()

export async function POST(req) {
    try {
        const reqBody = await req.json();
        const {email} = reqBody;

        const user = await User.findOne({email})

        if (!user) {
            return NextResponse.json({error: "Email is wrong!"}, {status: 400})
        }

        console.log(user);

        const emailRes = sendEmail({email, emailType: "RESET", userId: user?._id})

        return NextResponse.json({
            message: "Please follow the link we sent to your email!",
            success: true
        })


    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}