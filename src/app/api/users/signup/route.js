import {dbConnect} from '@/dbConfig/dbConfig';
import User from "@/models/UserModel"
import {NextResponse} from "next/server"
import bcrypt from "bcryptjs"
import {sendEmail} from "@/helpers/mailer";

dbConnect();

export async function POST(req) {
    try {
        const reqBody = await req.json();
        const {username, email, password} = reqBody;

        //check if user already exists
        const duplicateUser = await User.findOne({email})

        if (duplicateUser) {
            return NextResponse.json({error: "User already exists!"}, {status: 400})
        }

        //     hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({username, email, password: hashedPassword})

        const savedUser = await newUser.save()
        console.log(savedUser)

        // send verification email
        await sendEmail({email, emailType: "VERIFY", userId: savedUser?._id})

        return NextResponse.json({message: "User created successfully!", success: true, newUser})


    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}