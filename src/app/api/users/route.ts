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
    const status = searchParams.get("status") ?? "";
    const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
    const limit = 10;
    const offset = (page - 1) * limit;
    const like = `%${q}%`;

    const statusClause = status ? "AND status = ?" : "";
    const params = status
        ? [like, like, status, limit, offset]
        : [like, like, limit, offset];
    const countParams = status ? [like, like, status] : [like, like];

    const data = db
        .prepare(
            `SELECT id, email, name, role, status, created_at
       FROM users
       WHERE (name LIKE ? OR email LIKE ?) ${statusClause}
       LIMIT ? OFFSET ?`
        )
        .all(...params);

    const { total } = db
        .prepare(
            `SELECT COUNT(*) as total FROM users WHERE (name LIKE ? OR email LIKE ?) ${statusClause}`
        )
        .get(...countParams) as { total: number };

    // Si se filtra por status=active, devolvemos ese count como "active" también
    const active = status === "active" ? total : undefined;

    return NextResponse.json({ data, total, ...(active !== undefined && { active }), page, limit });
}
