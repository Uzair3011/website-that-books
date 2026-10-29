// Keyword map: "tradesmen" stays in the title and H1 (it is what people
// search); body copy says "trades" or "tradespeople". The hero image is the
// concept design from /work and is captioned as one, never as a client site.
import { stackedPage } from "../stacked-page.js";

export default stackedPage({
  path: "/web-design-for-trades-teesside",
  title: "Website Design for Tradesmen in Teesside | Veltra Media",
  description:
    "Websites for electricians, plumbers, roofers and joiners in Teesside: areas covered, tap-to-call, real photos and a quote form. Published prices from £99.",
  breadcrumbs: [
    { name: "Services", path: "/services" },
    { name: "Websites for trades", path: "/web-design-for-trades-teesside" },
  ],
  serviceName: "Website design for trades",
  serviceType: "Web design",
  eyebrow: "Websites for trades · Middlesbrough & Teesside",
  h1: "Website design for tradesmen across Teesside",
  lede: "Websites for electricians, plumbers, roofers, joiners and heating engineers across Middlesbrough and the Tees Valley, built around one job: getting the right customer to ring you or ask for a quote. Every price is published before we talk.",
  hero: {
    image: {
      src: "/assets/work/example-trades.svg",
      width: 1280,
      height: 900,
      alt: "A concept design for a home-services website: a large phone number, the areas covered, three service cards and a quote request form.",
    },
    caption: "Concept design for a fictional business, not a client’s website.",
  },
  sections: [
    {
      eyebrow: "How customers choose",
      heading: "Most customers pick a tradesperson from a phone screen, and quickly.",
      body: [
        "Someone with a leaking pipe or a tripped consumer unit is not browsing. They search the job and the town, “plumber Middlesbrough”, “electrician Stockton”, “roofer near me”, look at the first few businesses and ring the one that looks local, reliable and easy to reach. A trades website wins or loses that moment on its first screen.",
        "Planned work is judged differently but just as fast. A joiner, a kitchen fitter or a roofer quoting for a new roof is chosen on photos of real jobs, clear areas and how easy it is to ask for a price.",
      ],
    },
    {
      eyebrow: "What it must show",
      heading: "Six things every trades website needs.",
      band: "band-light",
      body: [
        `<ul>
          <li><strong>The areas you cover.</strong> Name the towns you really work in, such as Middlesbrough, Stockton-on-Tees, Redcar or Hartlepool, and leave out anywhere you would turn down. Our <a href="/areas">area pages</a> show how customers in each town search.</li>
          <li><strong>A phone-first layout.</strong> A tap-to-call button that stays within reach, the number as text rather than an image, and pages that load quickly on mobile data.</li>
          <li><strong>Emergency callout wording, only if you do callouts.</strong> Say what counts as an emergency, the hours and whether it costs more. If you do not do them, say so; it saves calls you would have to refuse.</li>
          <li><strong>Certifications and insurance, only real ones.</strong> Registration such as NICEIC or NAPIT for electrical work, Gas Safe for gas work, and public liability insurance, if you hold them. We only add what you can show us.</li>
          <li><strong>Photos of real work.</strong> Your jobs, your van, your team. Before-and-after pairs work well for roofers and joiners, and customers can spot stock photos.</li>
          <li><strong>A short quote form.</strong> The job, the postcode, how urgent it is and the best way to reach them. Nothing more until you have spoken.</li>
        </ul>`,
      ],
    },
    {
      eyebrow: "Trade by trade",
      heading: "What changes from one trade to the next.",
      body: [
        "<h3>Electricians</h3><p>Lead with your registration and, if you offer them, emergency hours. If you do landlord electrical safety reports (EICRs), give them their own page, because landlords search for them by name.</p>",
        "<h3>Plumbers and heating engineers</h3><p>For a plumber in Middlesbrough, the first screen usually needs the number, the areas and whether you take same-day work. Show your Gas Safe registration wherever gas work is offered, and split boiler servicing from breakdowns, since they are different searches.</p>",
        "<h3>Roofers</h3><p>Before-and-after photos do most of the selling. Mention storm or emergency repairs only if you do them, and a workmanship guarantee only if you give one in writing.</p>",
        "<h3>Joiners and builders</h3><p>The work is planned, so a gallery of finished jobs and an easy quote form matter more than a flashing phone button.</p>",
      ],
    },
    {
      eyebrow: "Beyond the website",
      heading: "Getting found, and answering when you are on a job.",
      band: "band-light",
      body: [
        `A trades website does most of its work alongside your Google Business Profile, so add <a href="/google-business-profile">Google Business Profile setup</a> to make the two match, and <a href="/local-seo-middlesbrough">local SEO for Middlesbrough and Teesside</a> to work on how often you appear in Maps. Most trades have no shop, so read <a href="/resources/google-business-profile-service-area-business">how to set up a Google Business Profile as a service area business</a> before you touch the address. If your Facebook page brings in most of your work today, our guide on <a href="/resources/do-i-need-a-website-if-i-have-facebook">whether a Facebook page is enough</a> sets out what a website adds.`,
        `If you are up a ladder when the phone rings, <a href="/ai-receptionist-middlesbrough">an AI receptionist can take the job details</a> and pass them to you; our <a href="/ai-agents-teesside">plain guide to AI agents</a> explains what that should and should not do. Quotes that go quiet can be chased automatically with <a href="/crm-booking-automation">quote follow-up and reminders</a>.`,
        `The packages are set out in full on <a href="/web-design-middlesbrough">our Middlesbrough web design page</a>. The designs on our <a href="/work">work page</a> include labelled concepts for fictional trades businesses; they show how we structure a site, not results for a client.`,
      ],
    },
  ],
  faqs: [
    {
      q: "How much does a website for a tradesperson cost?",
      a: '<p>A one-page site is £99 and a website of up to five pages is £179, both one-off and excluding VAT. Larger sites are quoted in writing. Every price is on <a href="/pricing">our price list for websites and add-ons</a>.</p>',
    },
    {
      q: "Most of my work comes from word of mouth. Do I need a website?",
      a: "<p>Word of mouth usually ends in a search: people look you up before they ring. A simple site with your areas, photos of real work and your number confirms you are the person they were told about.</p>",
    },
    {
      q: "Can my NICEIC or Gas Safe logo go on the site?",
      a: "<p>Yes, if you are registered. Schemes have their own rules on how their logos are used, so we follow them, and we can show your registration number so customers can check it themselves.</p>",
    },
    {
      q: "Should I mention emergency callouts if I only do them sometimes?",
      a: "<p>Describe exactly what you do. If you take emergency work at certain times or in certain areas, say that. A plain “no emergency callouts” saves you calls you would turn down.</p>",
    },
    {
      q: "I don’t have good photos of my work. What then?",
      a: "<p>Start taking them now: before and after, on your phone, in daylight. Until you have enough, we use a few plainly generic images and leave room for your own, rather than passing stock photos off as your jobs.</p>",
    },
    {
      q: "Do you build trades websites outside Middlesbrough?",
      a: "<p>Yes. We work across Stockton-on-Tees, Billingham, Redcar, Hartlepool and the wider Tees Valley, mostly online. We have no offices in those towns and are based in Middlesbrough.</p>",
    },
  ],
  relatedSections: [
    {
      heading: "What trades often add next",
      items: [
        {
          href: "/google-business-profile",
          label: "Google Business Profile",
          text: "Categories, service areas and photos that match the website. £99.",
        },
        {
          href: "/local-seo-middlesbrough",
          label: "Local SEO",
          text: "More chances to appear when someone nearby searches for your trade.",
        },
        {
          href: "/ai-receptionist-middlesbrough",
          label: "AI receptionist",
          text: "Calls and chats answered while you are with a customer. £199 setup.",
        },
        {
          href: "/resources/ai-receptionist-for-trades-teesside",
          label: "AI receptionist for trades in Teesside",
          text: "How an AI receptionist helps plumbers, electricians and builders in Teesside answer every call while on the job.",
        },
        {
          href: "/crm-booking-automation",
          label: "Quote follow-up",
          text: "Reminders and follow-ups so quotes do not go quiet. £199 setup.",
        },
      ],
    },
  ],
  closing: {
    heading: "Want a second opinion on your trade website?",
    body: "Send us your site, or tell us your trade and the towns you cover. The free audit tells you what to fix first, from the call button to your Google profile.",
  },
});
