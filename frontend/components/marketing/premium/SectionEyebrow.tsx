import { cn } from "@/lib/utils";

export default function SectionEyebrow({
  children,
  className,
  dark = false,
}: {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em]",
        dark
          ? "border-white/20 bg-white/10 text-white/90"
          : "border-termly-blue/20 bg-termly-blue/5 text-termly-blue",
        className
      )}
    >
      {children}
    </span>
  );
}
