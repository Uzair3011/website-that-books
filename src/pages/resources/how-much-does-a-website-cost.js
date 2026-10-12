// Keyword map: owns "how much does a website cost for a small business UK".
// No town name in the title or H1 (/pricing owns "website cost Middlesbrough").
// Every price is read from assets/catalog.js, the same list /pricing uses. No
// market-wide price ranges are quoted: we only state prices we can stand behind.
import { catalogItem } from "../../../assets/catalog.js";
import { articlePage, checklist, price, table } from "../../article-page.js";

const growth = catalogItem("growth-launch-package");
const separately = growth.includes.reduce((total, slug) => total + catalogItem(slug).price, 0);
const care = catalogItem("website-care").price;
const site = catalogItem("multi-page-website").price;
const seo = catalogItem("local-seo-google-business-profile").price;
const gbp = (amount) => `£${amount.toLocaleString("en-GB")}`;

export default articlePage({
  slug: "how-much-does-a-website-cost",
  title: "How Much Does a Website Cost for a UK Small Business?",
  description:
    "What a small business website costs in the UK: the build, the running costs and the extras, with worked examples, a quote checklist and questions to ask.",
  shortName: "How much does a website cost?",
  kind: "Guide",
  summary: "The build, the running costs and the extras, with worked examples and the questions to ask before you accept a quote.",
  eyebrow: "Guide · Website costs",
  h1: "How much does a website cost for a small business in the UK?",
  published: "2026-10-13",
  intro: [
    "How much does a website cost for a small business in the UK? Most quotes only answer part of the question. A website has three kinds of cost: the build, the running costs that keep it online, and the extras that are easy to forget until the invoice arrives. This guide explains each one, shows worked examples using our own published prices, and gives you a checklist for comparing quotes.",
  ],
  sections: [
    {
      id: "three-costs",
      toc: "The three costs",
      eyebrow: "The short answer",
      heading: "How much a website costs for a small business in the UK: three separate bills",
      body: [
        "When people compare quotes, they usually compare the build price and nothing else. That is how a cheap quote turns into an expensive website. Split every quote into these three parts before you compare it with anything:",
        table({
          head: ["Cost", "What it covers", "How often you pay"],
          rows: [
            ["The build", "Design, writing or arranging the words, building the pages, forms, basic search setup, testing and launch.", "Once, sometimes split into a deposit and a balance."],
            ["Running costs", "Domain name, hosting, business email, security updates, backups and support.", "Monthly or yearly, for as long as the site is live."],
            ["Extras", "Photography, copywriting, booking or payment tools, AI chat, paid ads, logo work.", "Once or monthly, depending on the tool."],
          ],
        }),
        "A quote that only shows the first row is not wrong, but it is incomplete. Ask what the other two rows will cost you in the first year, and in a normal year after that.",
      ],
    },
    {
      id: "build-price",
      toc: "What changes the build price",
      eyebrow: "The build",
      heading: "What makes one website cost more to build than another.",
      band: "band-light",
      body: [
        "Two websites can look similar and be priced very differently. The difference is almost always in one of these:",
        checklist([
          "<strong>Number of pages.</strong> A one-page site for a single offer is less work than a site with a page per service and per area.",
          "<strong>Who writes the words.</strong> If you supply finished text, the build is quicker. If the designer has to interview you and write it, that is real work and should be priced.",
          "<strong>Features.</strong> A contact form is simple. Online booking, payments, a shop, member logins or a quote calculator each add work and often a monthly tool cost.",
          "<strong>Design from scratch or from a template.</strong> Neither is automatically better. What matters is whether the result is fast, clear and built around how your customers decide.",
          "<strong>Moving old content.</strong> Bringing across dozens of old pages, blog posts or products takes time, and so does setting up redirects so old links keep working.",
          "<strong>Connections to other systems.</strong> Linking the site to a CRM, a calendar or an accounts package can be quick or slow depending on the system.",
        ]),
        "If you are not sure what you need, start smaller. A clear site with your services, areas, prices and a working phone link will do more for most local businesses than a large site with features nobody uses.",
      ],
    },
    {
      id: "running-costs",
      toc: "Running costs",
      eyebrow: "After launch",
      heading: "The running costs that keep a website online.",
      body: [
        "These are the costs that carry on after the launch. Some are paid to your web designer, some to other companies. Get each one written down.",
        `<ul>
          <li><strong>Domain name.</strong> Your web address, renewed every year with a registrar. Make sure it is registered in your business’s name, not the designer’s. If it lapses, your website and possibly your email stop working.</li>
          <li><strong>Hosting.</strong> The server the site lives on. Sometimes bundled into a care plan, sometimes billed separately.</li>
          <li><strong>Business email.</strong> An address at your own domain is usually a separate subscription, often charged per mailbox.</li>
          <li><strong>Maintenance and support.</strong> Updates, backups, monitoring and small changes. You can do some of this yourself, or pay for a plan. Ours is <a href="/website-care">website care and maintenance</a> from ${price("website-care")} a month, month to month.</li>
          <li><strong>Third-party tools.</strong> Booking software, a CRM, or the usage cost of an AI provider behind a chat or phone assistant. These are often monthly and can grow with use.</li>
        </ul>`,
        "Ask one simple question for each item: if I stop paying for this, what happens to my website? The answer tells you how much control you really have.",
      ],
    },
    {
      id: "worked-examples",
      toc: "Worked examples",
      eyebrow: "Worked examples",
      heading: "Three worked examples, using our own published prices.",
      band: "band-light",
      body: [
        "We use our own prices here because they are the only ones we can state accurately. Other providers price differently, and you should compare like with like. All figures exclude VAT, and any third-party costs are confirmed in writing before work starts.",
        table({
          caption: "One-off costs, excluding VAT",
          head: ["Situation", "What fits", "One-off cost"],
          rows: [
            ["A new business testing one offer, or running ads to one service", `<a href="/landing-page-design">A one-page landing page</a>`, price("landing-page")],
            ["An established local business that needs a proper site and a Google profile", `Multi-page website (${price("multi-page-website")}) plus local SEO and Google Business Profile setup (${price("local-seo-google-business-profile")})`, gbp(site + seo)],
            ["A business that also misses calls and loses track of enquiries", `The ${growth.name}: website, local SEO, AI receptionist and booking automation together`, `${gbp(growth.price)} (${gbp(separately)} if bought separately)`],
          ],
        }),
        `<h3>Working out the first year</h3><p>Take the second example and add the optional care plan at its starting price: ${gbp(site + seo)} one-off, plus 12 × ${gbp(care)} = ${gbp(care * 12)}, gives ${gbp(site + seo + care * 12)} for the first year, before VAT and before your domain and email. In year two, if nothing else changes, the cost is the care plan alone. If you would rather look after the site yourself, the first-year cost is the one-off figure plus your own domain and hosting.</p>`,
        `Every price and what it includes is on <a href="/pricing">our website and SEO price list</a>. If your project needs ecommerce, memberships or unusual integrations, it gets a written quote instead of a package.`,
      ],
    },
    {
      id: "comparing-quotes",
      toc: "Comparing quotes",
      eyebrow: "Before you sign",
      heading: "A checklist for comparing website quotes.",
      body: [
        "Put each quote side by side and get an answer to every line below. A quote that cannot answer them is harder to compare, whatever the price.",
        checklist([
          "Is VAT included or extra?",
          "How many pages, and which ones?",
          "Who writes the words and who supplies the photos?",
          "Who owns the domain, the website files and the content when the work is finished?",
          "Is hosting included? For how long? What does it cost after that?",
          "What is the monthly or yearly cost, and what exactly does it cover?",
          "What happens to the site if you stop paying the monthly fee?",
          "How many rounds of changes are included before launch?",
          "Which third-party costs are there, and are they passed on at cost or marked up?",
          "What is the timeline, and when does it start?",
          "Can you get your site and data back if you move to someone else?",
        ]),
        `Our answers to most of these are on the <a href="/how-it-works">website design process page</a> and in the pricing FAQ. If a provider gives vague answers to the ownership questions, treat that as a warning.`,
      ],
    },
    {
      id: "cheap-or-expensive",
      toc: "Cheap or expensive?",
      eyebrow: "Getting value",
      heading: "When cheap is fine, and when it costs you more.",
      band: "band-light",
      body: [
        "A low price is fine when the site does its job: it loads quickly on a phone, says clearly what you do and where, shows prices or a starting point, and makes it easy to call or send an enquiry. Plenty of local businesses need nothing more to start with.",
        "Cheap becomes expensive in a few predictable ways:",
        `<ul>
          <li><strong>You do not own it.</strong> Some low monthly plans keep the site on their platform. Stop paying and you start again from nothing.</li>
          <li><strong>Nobody looks after it.</strong> A site that is never updated or backed up can break, and a broken contact form loses enquiries without anyone noticing.</li>
          <li><strong>It says nothing specific.</strong> A template with generic text gives customers no reason to pick you and gives Google little to match to local searches.</li>
          <li><strong>Extras are added later.</strong> A low build price followed by charges for every small change can cost more over a year than a higher, clearer quote.</li>
        </ul>`,
        `Expensive is not automatically better either. A large quote often includes features you may not need yet. If you are still deciding whether you need a website at all, our guide on <a href="/resources/do-i-need-a-website-if-i-have-facebook">whether a Facebook page is enough</a> is a better starting point.`,
      ],
    },
    {
      id: "this-week",
      toc: "What to do this week",
      eyebrow: "What to do this week",
      heading: "Four things to do before you ask for a quote.",
      body: [
        `<ol>
          <li><strong>Write down the one job the website must do.</strong> More phone calls? Booked appointments? Quote requests? It decides what you need to pay for.</li>
          <li><strong>List your pages.</strong> Home, one page per main service, an about page, a contact page. If the list is short, so should the quote be.</li>
          <li><strong>Check who owns your domain.</strong> If you already have one, find the registrar login and confirm it is in your business’s name.</li>
          <li><strong>Set a first-year budget, not a build budget.</strong> Include the build, a year of running costs and any tools you need, so you compare quotes on the same basis.</li>
        </ol>`,
        `If you are in Middlesbrough or nearby and want a fixed price, our <a href="/web-design-middlesbrough">web design service in Middlesbrough</a> publishes every price up front, and we work with businesses in <a href="/areas">every Tees Valley town we cover</a>.`,
      ],
    },
  ],
  relatedItems: [
    { href: "/pricing", label: "Our price list", text: "Every package and service, with what it includes, excluding VAT." },
    { href: "/website-care", label: "Website care and maintenance", text: `Hosting, updates, backups and support from ${price("website-care")} a month.` },
    { href: "/resources/do-i-need-a-website-if-i-have-facebook", label: "Is a Facebook page enough?", text: "What a website does that a Facebook page cannot." },
  ],
  closing: {
    heading: "Want to know what your business actually needs?",
    body: "Ask for a free audit. We look at your current site and Google presence, then tell you what is worth paying for, and what is not, before you spend anything.",
  },
});
