"use client";
import { useRouter } from "next/navigation";

type Props = {
    email: string;
};

export default function Header({ email }: Props) {
    const router = useRouter();

    async function handleLogout() {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
    }

    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
            <h1 className="text-lg font-semibold text-gray-800">DevPanel</h1>
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{email}</span>
                <button
                    onClick={handleLogout}
                    className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                    Salir
                </button>
            </div>
        </header>
    );
}
