import type { ReactNode } from "react";
import PageContainer from "@/components/shared/PageContainer";
import SectionWrapper from "@/components/shared/SectionWrapper";

type PageScaffoldProps = {
    title: string;
    subtitle: string;
    children: ReactNode;
};

export default function PageScaffold({ title, subtitle, children }: PageScaffoldProps) {
    return (
        <main className="pb-20 pt-28">
            <SectionWrapper className="pb-10 pt-10 md:pt-16">
                <PageContainer>
                    <div className="max-w-3xl">
                        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-brand-600">Resources</p>
                        <h1 className="mt-4 text-5xl font-black leading-tight text-slate-950 md:text-6xl">{title}</h1>
                        <p className="mt-5 text-lg font-medium leading-8 text-slate-600">{subtitle}</p>
                    </div>
                </PageContainer>
            </SectionWrapper>
            <SectionWrapper className="pt-4">
                <PageContainer>{children}</PageContainer>
            </SectionWrapper>
        </main>
    );
}
