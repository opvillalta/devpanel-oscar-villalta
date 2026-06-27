import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const payload = token ? await verifyToken(token) : null;
    if (!payload) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = req.nextUrl;
    const q = searchParams.get("q") ?? "";
    const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
    const limit = 10;
    const offset = (page - 1) * limit;
    const like = `%${q}%`;

    const data = db
        .prepare(
            `SELECT id, email, name, role, status, created_at
       FROM users
       WHERE name LIKE ? OR email LIKE ?
       LIMIT ? OFFSET ?`
        )
        .all(like, like, limit, offset);

    const { total } = db
        .prepare(
            `SELECT COUNT(*) as total FROM users WHERE name LIKE ? OR email LIKE ?`
        )
        .get(like, like) as { total: number };

    return NextResponse.json({ data, total, page, limit });
}
