import { cookies } from "next/headers";
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

    // Fetch server-side para las métricas
    const res = await fetch("http://localhost:3000/api/users?limit=1", {
        headers: { Cookie: `token=${token}` },
        cache: "no-store",
    });
    const { total } = await res.json();

    return (
        <div className="min-h-screen bg-gray-100">
            <Header email={payload.email} />
            <main className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <MetricCard label="Total de usuarios" value={total} />
                    <MetricCard label="Usuario logueado" value={payload.role} />
                </div>
                <UserTable />
            </main>
        </div>
    );
}
