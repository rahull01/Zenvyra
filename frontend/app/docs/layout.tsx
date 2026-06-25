import Link from "next/link";
import { getDocsNavigation } from "@/lib/docs-content";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const navigation = getDocsNavigation();

  return (
    <div className="min-h-screen bg-background-base">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-6 lg:h-[calc(100vh-48px)] lg:overflow-y-auto">
          <nav aria-label="Documentation navigation" className="border-r border-border-light pr-6">
            <Link href="/" className="text-sm font-semibold text-primary">
              Zenvyra
            </Link>
            <p className="mt-3 text-xs font-semibold uppercase tracking-normal text-text-muted">
              Documentation
            </p>
            <ul className="mt-4 space-y-6">
              {Object.entries(navigation).map(([category, pages]) => (
                <li key={category}>
                  <p className="text-sm font-bold capitalize text-text-primary">
                    {category.replaceAll("-", " ")}
                  </p>
                  <ul className="mt-2 space-y-2">
                    {pages.map((page) => (
                      <li key={`${page.category}/${page.slug}`}>
                        <Link
                          href={`/docs/${page.category}/${page.slug}`}
                          className="text-sm leading-6 text-text-secondary hover:text-primary"
                        >
                          {page.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <section>{children}</section>
      </div>
    </div>
  );
}
