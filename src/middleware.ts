import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const payload = token ? await verifyToken(token) : null;

    if (!payload) {
        const isApi = req.nextUrl.pathname.startsWith("/api/");
        if (isApi) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/api/users/:path*"],
};
