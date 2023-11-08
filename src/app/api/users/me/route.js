import {getDataFromToken} from "@/helpers/getDataFromToken";
import {NextRequest, NextResponse} from "next/server";
import User from "@/models/UserModel";
import {dbConnect} from "@/dbConfig/dbConfig";

dbConnect()

export async function GET(request){
    try {
        const currentUserId = await getDataFromToken(request)

        const user = await User.findById(currentUserId).select("-password").lean().exec();

        return NextResponse.json({message : "User found", data : user})

    }catch (error){
        return NextResponse.json({error: error.message}, {status: 500})
    }
}