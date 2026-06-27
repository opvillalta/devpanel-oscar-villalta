import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import Header from "../components/Header";
import MetricCard from "../components/MetricCard";
import UserTable from "../components/UserTable";

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const payload = token ? await verifyToken(token) : null;

    if (!payload) redirect("/login");

    // Construimos la base URL desde las headers del request — sin puerto hardcodeado
    const headersList = await headers();
    const host = headersList.get("host") ?? "localhost:3000";
    const proto = process.env.NODE_ENV === "production" ? "https" : "http";
    const baseUrl = `${proto}://${host}`;

    const res = await fetch(`${baseUrl}/api/users?q=&page=1`, {
        headers: { Cookie: `token=${token}` },
        cache: "no-store",
    });
    const { total } = await res.json();

    const resActive = await fetch(`${baseUrl}/api/users?q=&page=1&status=active`, {
        headers: { Cookie: `token=${token}` },
        cache: "no-store",
    });
    const { active } = await resActive.json();

    return (
        <div className="min-h-screen bg-gray-100">
            <Header email={payload.email} />
            <main className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <MetricCard label="Total de usuarios" value={total} />
                    <MetricCard label="Usuarios activos" value={active} />
                </div>
                <UserTable />
            </main>
        </div>
    );
}
