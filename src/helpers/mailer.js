import nodemailer from "nodemailer"
import User from "@/models/UserModel";
import bcrypt from "bcryptjs";

export const sendEmail = async ({email, emailType, userId}) => {
    try {
        // creating hashed token
        const hashedToken = await bcrypt.hash(userId.toString(), 10)

        if (emailType === "VERIFY") {
            const user = await User.findByIdAndUpdate(userId, {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + (60 * 60 * 24 * 1000)
            })
        } else if (emailType === "RESET") {
            const user = await User.findByIdAndUpdate(userId, {
                forgotPasswordToken: hashedToken,
                forgotPasswordTokenExpiry: Date.now() + (60 * 60 * 24 * 1000)
            })
        }

        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PWS
            }
        })

        const subject = emailType === "VERIFY" ? "Verify your email!" : "Reset your password!"

        const htmlEmailFormat = emailType === "VERIFY" ? `<p> Click <a
            href=${process.env.DOMAIN}/verifyemail?token=${hashedToken} target="_blank" > here </a> to verify your email
            or copy and paste the link below in your
            browser. <br/> ${process.env.DOMAIN}/verifyemail?token=${hashedToken} </p>` : `<p> Click <a
            href=${process.env.DOMAIN}/resetpassword?token=${hashedToken} target="_blank" > here </a> to reset your passsword
            or copy and paste the link below in your
            browser. <br/> ${process.env.DOMAIN}/resetpassword?token=${hashedToken} </p>`

        const mailOptions = {
            from: "pyaepsk@gmail.com",
            to: email,
            subject: subject,
            html: htmlEmailFormat
        }

        const mailRes = await transporter.sendMail(mailOptions);
        return mailRes;

    } catch (error) {
        throw new Error(error.message)
    }
}
