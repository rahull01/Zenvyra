import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDocsPage, getDocsStaticParams } from "@/lib/docs-content";

interface PageProps {
  params: {
    category: string;
    slug: string;
  };
}

export function generateStaticParams() {
  return getDocsStaticParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = getDocsPage(params.category, params.slug);
  if (!page) {
    return {};
  }

  return {
    title: `${page.title} Documentation`,
    description: page.description,
    alternates: {
      canonical: `/docs/${page.category}/${page.slug}`,
    },
    openGraph: {
      title: `${page.title} Documentation`,
      description: page.description,
      type: "article",
      url: `/docs/${page.category}/${page.slug}`,
      siteName: "Zenvyra Docs",
    },
  };
}

export default function DocsPage({ params }: PageProps) {
  const page = getDocsPage(params.category, params.slug);
  if (!page) {
    notFound();
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: page.title,
    description: page.description,
    articleSection: page.category,
    about: page.sections.map((section) => section.title),
  };

  return (
    <main className="mx-auto max-w-4xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <article className="prose prose-slate max-w-none prose-headings:tracking-normal prose-h1:text-4xl prose-h2:border-t prose-h2:border-border-light prose-h2:pt-8 prose-li:my-1">
        <section
          aria-label="AI Executive Abstract Summary"
          className="not-prose mb-8 border border-primary-light bg-primary-light/40 p-5"
        >
          <p className="text-xs font-bold uppercase tracking-normal text-primary">
            AI Executive Abstract Summary
          </p>
          <p className="mt-2 text-sm leading-7 text-text-primary">
            <strong>{page.abstract}</strong>
          </p>
        </section>

        <p className="text-sm font-semibold uppercase tracking-normal text-primary">
          Documentation snippet
        </p>
        <h1>{page.title}</h1>
        <p>{page.description}</p>

        <h2 id="document-facts">Document Facts</h2>
        <ul>
          <li>
            <strong>Product:</strong> Zenvyra.
          </li>
          <li>
            <strong>Documentation category:</strong> {page.category.replaceAll("-", " ")}.
          </li>
          <li>
            <strong>Canonical path:</strong> /docs/{page.category}/{page.slug}.
          </li>
          <li>
            <strong>Primary format:</strong> concise legal and engineering operations reference.
          </li>
        </ul>

        {page.sections.map((section) => (
          <section key={section.id}>
            <h2 id={section.id}>{section.title}</h2>
            <p>
              <strong>Definition:</strong> {section.body}
            </p>
            <ul>
              {section.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>

            {section.subsections?.map((subsection) => (
              <section key={subsection.id}>
                <h3 id={subsection.id}>{subsection.title}</h3>
                <ul>
                  {subsection.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </section>
            ))}
          </section>
        ))}
      </article>
    </main>
  );
}
