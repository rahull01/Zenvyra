"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
    const router = useRouter();

    return (
        <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="group inline-flex h-11 items-center gap-2 rounded-full border border-slate-200/80 bg-white/85 px-4 text-sm font-semibold text-slate-600 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.45)] backdrop-blur-xl transition-all duration-300 hover:-translate-x-0.5 hover:border-slate-300 hover:bg-white hover:text-slate-950 hover:shadow-[0_14px_34px_-22px_rgba(15,23,42,0.55)]"
        >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
            <span className="hidden sm:inline">Back</span>
        </button>
    );
}
