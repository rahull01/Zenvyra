import { Skeleton } from "@/components/ui/skeleton";
import PageContainer from "@/components/shared/PageContainer";

export default function MarketingLoading() {
    return (
        <main className="pb-16 pt-14">
            <PageContainer>
                <Skeleton className="h-12 w-80 bg-surface-700/60" />
                <Skeleton className="mt-4 h-5 w-full max-w-2xl bg-surface-700/60" />
                <div className="mt-10 grid gap-5 md:grid-cols-3">
                    <Skeleton className="h-52 bg-surface-700/60" />
                    <Skeleton className="h-52 bg-surface-700/60" />
                    <Skeleton className="h-52 bg-surface-700/60" />
                </div>
            </PageContainer>
        </main>
    );
}
