"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/lib/useDebounce";

type User = {
    id: number;
    email: string;
    name: string;
    role: string;
    status: string;
    created_at: string;
};

export default function UserTable() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [data, setData] = useState<User[]>([]);
    const [total, setTotal] = useState(0);
    const debouncedQuery = useDebounce(query, 300);
    const limit = 10;

    useEffect(() => {
        async function load() {
            const res = await fetch(
                `/api/users?q=${encodeURIComponent(debouncedQuery)}&page=${page}`
            );
            if (res.status === 401) {
                router.push("/login");
                return;
            }
            const json = await res.json();
            setData(json.data);
            setTotal(json.total);
        }
        load();
    }, [debouncedQuery, page, router]);

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="p-4 border-b">
                <input
                    type="text"
                    placeholder="Buscar por nombre o email..."
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 text-left">
                    <tr>
                        <th className="px-4 py-3">Nombre</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Rol</th>
                        <th className="px-4 py-3">Estado</th>
                        <th className="px-4 py-3">Creado</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {data.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50 transition">
                            <td className="px-4 py-3 font-medium">{u.name}</td>
                            <td className="px-4 py-3 text-gray-500">{u.email}</td>
                            <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                                    {u.role}
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                    {u.status}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-gray-400">{u.created_at}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex items-center justify-between px-4 py-3 border-t text-sm">
                <span className="text-gray-500">{total} usuarios totales</span>
                <div className="flex gap-2">
                    <button
                        onClick={() => setPage((p) => p - 1)}
                        disabled={page === 1}
                        className="px-3 py-1 rounded border disabled:opacity-40 hover:bg-gray-50"
                    >
                        Anterior
                    </button>
                    <span className="px-3 py-1">{page} / {totalPages}</span>
                    <button
                        onClick={() => setPage((p) => p + 1)}
                        disabled={page >= totalPages}
                        className="px-3 py-1 rounded border disabled:opacity-40 hover:bg-gray-50"
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
}
