import React, { ReactNode } from "react";

type SectionWrapperProps = {
    children: ReactNode;
    className?: string;
};

export default function SectionWrapper({ children, className = "" }: SectionWrapperProps) {
    return <section className={`py-14 md:py-20 ${className}`.trim()}>{children}</section>;
}
