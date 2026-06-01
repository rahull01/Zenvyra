"use client";

const LOGOS = [
  "Stripe", "Shopify", "Notion", "Webflow", "Vercel", "Figma", "HubSpot", "Intercom",
];

export default function LogoMarquee() {
  const items = [...LOGOS, ...LOGOS];
  return (
    <div className="relative overflow-hidden py-2">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-all-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-all-white to-transparent" />
      <div className="flex w-max animate-marquee gap-16 whitespace-nowrap">
        {items.map((name, i) => (
          <span
            key={`${name}-${i}`}
            className="inline-flex items-center text-xl font-bold tracking-tight text-all-text/[0.18]"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
