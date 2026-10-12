// A short intro plus a link to every area page (docs/seo/keyword-map.md). It
// must not say "web design", "SEO" or "local SEO" in its title or H1.
import { SITE, breadcrumbJsonLd, finalCta, related } from "../site.js";

const AREAS = [
  {
    href: "/web-design-middlesbrough",
    label: "Middlesbrough",
    text: "Where Veltra Media is based. Websites, packages and timelines in full.",
  },
  {
    href: "/web-design-stockton-on-tees",
    label: "Stockton-on-Tees & Billingham",
    text: "The whole borough, with a dedicated section for Billingham.",
  },
  {
    href: "/web-design-redcar",
    label: "Redcar",
    text: "Seaside businesses serving residents and visitors, plus local SEO.",
  },
  {
    href: "/web-design-hartlepool",
    label: "Hartlepool",
    text: "From the Headland to Seaton Carew, north of the Tees.",
  },
  {
    href: "/web-design-teesside",
    label: "Tees Valley",
    text: "For businesses that cover several towns across the region.",
  },
];

const path = "/areas";
const title = "Areas We Serve Across the Tees Valley | Veltra Media";
const description =
  "The towns Veltra Media works in: Middlesbrough, Stockton-on-Tees and Billingham, Redcar, Hartlepool and the wider Tees Valley, with a page for each area.";

const body = `      <section class="hero">
        <div class="container narrow">
          <p class="eyebrow">Areas we serve</p>
          <h1>Areas we serve across the Tees Valley</h1>
          <p class="lede">Veltra Media is based in Middlesbrough and works with businesses across the Tees Valley. We have no offices in the other towns: projects run online, and we can meet in person around Teesside when that helps. Each area below has its own page on how customers there search and what a website needs to be found.</p>
        </div>
      </section>

${related(AREAS, "Choose your area")}

${related(
  [
    {
      href: "/services",
      label: "All services",
      text: "Websites, local search, landing pages, AI reception and booking automation.",
    },
    {
      href: "/pricing",
      label: "Prices",
      text: "Every package priced in one place, before you get in touch.",
    },
    {
      href: "/free-website-audit",
      label: "Free website audit",
      text: "Find out what your current site needs before you spend anything.",
    },
  ],
  "Wherever you are",
)}

${finalCta({
  heading: "Work somewhere not on this list?",
  body: `We also work remotely with businesses elsewhere in the UK. Tell us where you are and what you need, and we will tell you honestly whether we are a good fit.`,
})}`;

export default {
  path,
  title,
  description,
  jsonLd: [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Areas we serve across the Tees Valley",
      description,
      url: SITE.origin + path,
      isPartOf: { "@id": `${SITE.origin}/#website` },
      about: { "@id": `${SITE.origin}/#organization` },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: AREAS.map((area, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: area.label,
          url: SITE.origin + area.href,
        })),
      },
    },
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Areas", path },
    ]),
  ],
  body,
};
