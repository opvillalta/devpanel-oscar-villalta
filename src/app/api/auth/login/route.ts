import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();

    const user = db
        .prepare("SELECT * FROM users WHERE email = ? AND status = 'active'")
        .get(email) as {
            id: number;
            email: string;
            password: string;
            role: string;
            status: string;
        } | undefined;

    const validPassword = user
        ? await bcrypt.compare(password, user.password)
        : false;

    if (!user || !validPassword) {
        return NextResponse.json(
            { error: "Credenciales inválidas" },
            { status: 401 }
        );
    }

    const token = await signToken({ sub: String(user.id), email: user.email, role: user.role });

    const response = NextResponse.json({ ok: true });
    response.cookies.set("token", token, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 8,
    });

    return response;
}
