import {NextResponse} from 'next/server'

export function middleware(request) {
    const path = request.nextUrl.pathname;

    const isPublicPaths = path === "/login" || path === "/signup" || path === "/verifyemail" || path === "/forgotpassword"

    const token = request.cookies.get("token")?.value || ""

    if (isPublicPaths && token) {
        return NextResponse.redirect(new URL("/", request.nextUrl))
    }

    if (!isPublicPaths && !token) {
        return NextResponse.redirect(new URL("/login", request.nextUrl))
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        "/",
        "/profile",
        "/login",
        "/signup",
        "/verifyemail"
    ],
}