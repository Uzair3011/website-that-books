// Keyword map: owns "local SEO checklist". No "tradesmen" in the title or H1
// (the trades page owns "local SEO for tradesmen"). Takes in the website points
// of the old "Nine things to fix" guide on /resources.
import { articlePage, checklist, price, table } from "../../article-page.js";

export default articlePage({
  slug: "local-seo-checklist",
  title: "Local SEO Checklist for Small Businesses | Veltra Media",
  description:
    "A local SEO checklist for small businesses: Google Business Profile, website, business details, reviews and tracking, in the order worth doing them.",
  shortName: "Local SEO checklist",
  kind: "Checklist",
  summary: "Google Business Profile, website, business details, reviews and tracking, in the order worth doing them.",
  eyebrow: "Checklist · Local search",
  h1: "A local SEO checklist you can work through yourself",
  published: "2026-10-13",
  intro: [
    "This local SEO checklist covers the work that helps a small business show up when people nearby search for what it does. None of it needs a developer, and most of it costs nothing but time. Work through it in order: the early sections fix the problems that hold most local businesses back, and the later ones only pay off once those are right.",
  ],
  sections: [
    {
      id: "how-to-use",
      toc: "How to use this checklist",
      eyebrow: "Before you start",
      heading: "How to use this local SEO checklist",
      body: [
        "Local SEO is the work that helps you appear in Google’s map results and in ordinary results for searches like “electrician Stockton” or “dog groomer near me”. It has five parts. Do them in this order, one sitting at a time:",
        table({
          head: ["Part", "What it covers", "Where you do it"],
          rows: [
            ["1. Google Business Profile", "Categories, services, areas, hours, photos", "Google Business Profile"],
            ["2. Your website", "Page titles, service and area pages, contact details", "Your website"],
            ["3. Business details everywhere", "The same name, phone number and areas on every listing", "Directories, social media, trade bodies"],
            ["4. Reviews", "Asking for them, and replying", "Google Business Profile"],
            ["5. Tracking", "Knowing what is working", "Google Business Profile, Search Console, your own notes"],
          ],
        }),
        "Nothing here guarantees a position in Google. Nobody controls that. What you can control is giving Google accurate, complete and consistent information, and giving customers a reason to pick you.",
      ],
    },
    {
      id: "google-profile",
      toc: "1. Google Business Profile",
      eyebrow: "Part 1",
      heading: "Get your Google Business Profile complete and accurate.",
      band: "band-light",
      body: [
        "For most local businesses, the profile is the first thing a customer sees. Start here.",
        checklist([
          "The profile is claimed and verified, and you can log in to it yourself.",
          "The primary category is the most specific one that fits, such as “Plumber” rather than “Contractor”.",
          "Secondary categories cover your other main services, and only those.",
          "Every service you offer is listed, in the words customers use.",
          "If customers visit you, the address is right. If you go to them, the address is hidden and service areas are set.",
          "Opening hours are correct, including bank holidays and any seasonal changes.",
          "The phone number and website link work, and match your website exactly.",
          "The description says what you do and where, in plain English, without a list of keywords.",
          "There are recent photos of your real work, vehicles, premises or team.",
        ]),
        `If you work from home or travel to customers, read our guide to <a href="/resources/google-business-profile-service-area-business">setting up a Google Business Profile as a service area business</a> before you change the address.`,
      ],
    },
    {
      id: "website",
      toc: "2. Your website",
      eyebrow: "Part 2",
      heading: "Make your website say what you do and where.",
      body: [
        "Your website backs up the profile. Google reads it, and customers check it before they call.",
        checklist([
          "The first line of the homepage says what you do and for whom, not your company values.",
          "The areas you cover are written out in words: “Middlesbrough, Stockton and Redcar” beats “the North East”.",
          "Each main service has its own page, with real detail about that service.",
          "Every page has its own title that names the service and, where it fits, the place.",
          "Each page has one main heading that matches what the page is about.",
          "Your phone number is in the header as a tappable link, not text in an image.",
          "Your business name, phone number and areas match your Google profile exactly.",
          "The site loads in a few seconds on a phone on mobile data. Test it yourself.",
          "You have sent a test enquiry through every form and checked the email arrived.",
          "Prices, a price range or a starting price are shown for your main services.",
          "Photos show your real work, not stock images of strangers.",
          "The copyright year in the footer is current.",
        ]),
        "One warning: do not create lots of near-identical pages with only the town name changed. They give customers nothing new, and Google’s spam policies describe pages like that as doorway pages. A page for a town is worth having only if it says something genuinely useful about working there.",
      ],
    },
    {
      id: "consistency",
      toc: "3. Business details everywhere",
      eyebrow: "Part 3",
      heading: "Use the same business details everywhere you are listed.",
      band: "band-light",
      body: [
        "Your business name, phone number and areas should be identical wherever they appear. Small differences, like an old mobile number on a directory, make it harder for customers and for Google to be sure they are looking at the same business.",
        table({
          head: ["Where", "What to check"],
          rows: [
            ["Your website", "Header, footer, contact page and any schema markup"],
            ["Google Business Profile", "Name, phone, website, areas"],
            ["Facebook, Instagram, LinkedIn", "About section and contact buttons"],
            ["Bing Places and Apple Business Connect", "Whether you have a listing, and whether it is accurate"],
            ["Directories and trade sites", "Any you appear on, including old ones you have forgotten about"],
            ["Trade bodies and local groups", "Member listings and links"],
          ],
        }),
        "Use your real business name, exactly as customers see it on your van, invoices or sign. Adding extra keywords or a town to the name on your Google profile is against Google’s guidelines and can get the profile suspended.",
      ],
    },
    {
      id: "reviews",
      toc: "4. Reviews",
      eyebrow: "Part 4",
      heading: "Ask for reviews, and reply to every one.",
      body: [
        "Google says reviews are one of the things it considers in local ranking, and customers read them closely. Make asking a habit, not a campaign.",
        checklist([
          "Get the direct review link from your profile and save it on your phone.",
          "Ask every customer at the moment they are happiest, usually when the job is finished.",
          "Ask everyone, not only the customers you expect to be happy. Google’s policies do not allow selectively asking for positive reviews.",
          "Never offer a discount, gift or entry into a draw for a review. That breaks Google’s policies too.",
          "Reply to every review, good or bad, calmly and briefly. Future customers read the replies.",
          "Never write reviews for yourself, or ask friends and family to pose as customers.",
        ]),
        `For more on what affects your position in the map once the basics are in place, read <a href="/resources/rank-in-google-maps-without-a-shop">how to rank in Google Maps without a shop</a>.`,
      ],
    },
    {
      id: "tracking",
      toc: "5. Tracking",
      eyebrow: "Part 5",
      heading: "Track what is working, once a month.",
      band: "band-light",
      body: [
        "Fifteen minutes a month is enough. Look at the same three things each time and write the numbers down:",
        `<ul>
          <li><strong>Your Google Business Profile performance figures.</strong> Calls, website clicks, direction requests and the searches that showed your profile.</li>
          <li><strong>Google Search Console.</strong> A free Google tool that shows which searches your website appears for and how often people click. You need to verify you own the site to use it.</li>
          <li><strong>Your own enquiries.</strong> Ask every new customer how they found you, and keep a tally.</li>
        </ul>`,
        "The tally is the most useful of the three. Figures from Google tell you what people saw; your tally tells you what turned into work.",
        "Use the numbers to decide what to do next month, not to judge yourself. If calls from the profile are steady but website clicks are low, the profile is doing its job and the website can wait. If people visit the website but few get in touch, look at the page they land on: is the phone number easy to tap, and does it answer the obvious questions about price and area? If nothing is moving at all, go back to parts one and two.",
      ],
    },
    {
      id: "this-week",
      toc: "What to do this week",
      eyebrow: "What to do this week",
      heading: "Start with these five, this week.",
      body: [
        `<ol>
          <li>Log in to your Google Business Profile and check the primary category, hours and phone number.</li>
          <li>Add five recent photos of real work to the profile.</li>
          <li>Save your review link on your phone and ask your next three customers.</li>
          <li>Check your website header has a tappable phone number, and send yourself a test enquiry.</li>
          <li>Search for your business name and note every listing that has an old phone number or address. Fix one a day.</li>
        </ol>`,
        `If you would rather hand it over, our <a href="/local-seo-middlesbrough">local SEO service for Middlesbrough and Teesside</a> covers parts one to three, and <a href="/google-business-profile">Google Business Profile optimisation</a> is included in the same ${price("local-seo-google-business-profile")} setup.`,
      ],
    },
  ],
  relatedItems: [
    { href: "/local-seo-middlesbrough", label: "Local SEO in Middlesbrough", text: "When you would rather someone else did the work." },
    { href: "/resources/google-business-profile-service-area-business", label: "Profiles for service area businesses", text: "Hiding your address, choosing areas and verifying." },
    { href: "/resources/rank-in-google-maps-without-a-shop", label: "Ranking in Google Maps without a shop", text: "What affects your position once the profile exists." },
  ],
  closing: {
    heading: "Worked through the checklist and still not getting enquiries?",
    body: "That usually means the problem is somewhere the checklist cannot see. The free audit looks at your website and Google profile together and tells you what to fix first.",
  },
});
