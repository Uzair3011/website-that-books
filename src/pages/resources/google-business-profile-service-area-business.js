// Keyword map: owns "Google Business Profile service area business". No
// "optimisation", "rank" or town name in the title or H1. Covers setup:
// hiding the address, choosing areas and verifying. Takes in the old "Getting
// a Google Business Profile right" guide on /resources. Google's rules quoted
// here are listed in docs/seo/owner-todo.md to recheck, because Google changes them.
import { articlePage, checklist, price, table } from "../../article-page.js";

export default articlePage({
  slug: "google-business-profile-service-area-business",
  title: "Google Business Profile for Service Area Businesses",
  description:
    "How to set up a Google Business Profile as a service area business: hiding your address, choosing service areas, verifying and the mistakes to avoid.",
  shortName: "Google Business Profile for service area businesses",
  kind: "Guide",
  summary: "Hiding your address, choosing service areas, getting verified and the mistakes that get profiles suspended.",
  eyebrow: "Guide · Google Business Profile",
  h1: "Google Business Profile for service area businesses",
  published: "2026-10-13",
  intro: [
    "If you go to your customers rather than them coming to you, Google Business Profile lets you set up as a service area business: your address stays hidden and you tell Google which areas you cover instead. Most trades, mobile services and home-based businesses fit this. This guide covers who qualifies, how to set it up, how to choose your areas and how to get through verification.",
  ],
  sections: [
    {
      id: "what-it-is",
      toc: "What it means",
      eyebrow: "The basics",
      heading: "What a service area business is on Google Business Profile",
      body: [
        "Google sorts local businesses by where they meet customers. That decides whether your profile shows an address, a list of areas, or both.",
        table({
          head: ["Type", "Where you serve customers", "What the profile shows"],
          rows: [
            ["Storefront", "At your premises, such as a shop, salon or office", "Your address"],
            ["Service area business", "At the customer’s home or site", "Your service areas; the address is hidden"],
            ["Both", "At your premises and at customers’ locations", "Your address and your service areas"],
          ],
        }),
        "A plumber, a mobile dog groomer, a cleaner or an electrician working from home is a service area business. A café is a storefront. A garage that also does mobile repairs can be both.",
      ],
    },
    {
      id: "who-qualifies",
      toc: "Who qualifies",
      eyebrow: "Eligibility",
      heading: "Who can have a profile without a public address.",
      band: "band-light",
      body: [
        "To be eligible for a profile at all, your business has to make in-person contact with customers during the hours you list. A business that only works online, with no face-to-face contact, does not qualify.",
        checklist([
          "You visit or deliver to customers in person: you qualify as a service area business.",
          "You work from home and customers do not come to you: hide the address.",
          "Customers visit you sometimes, at a place that is staffed during your hours: you can show the address as well as service areas.",
          "Your only address is a PO box or a mail-forwarding address: that does not count as a business address for Google.",
          "You rent a virtual office that is not staffed by you during your opening hours: that is not eligible either.",
        ]),
        "<h3>A workshop, yard or unit</h3><p>If you have a workshop or unit, the question is the same: do customers come to it during your opening hours, and is someone there to meet them? If yes, you can show that address as well as your service areas. If it is only where you keep tools and materials, keep it hidden and list service areas only. If you move, update the profile before you change anything else, and expect Google to ask you to verify again.</p>",
        "Even with the address hidden, Google still asks for it during setup. It uses it to verify the business and to understand where you are based. Customers will not see it.",
      ],
    },
    {
      id: "set-up",
      toc: "Setting it up",
      eyebrow: "Step by step",
      heading: "Setting up the profile, or switching an existing one.",
      body: [
        "Google changes the wording and order of its screens from time to time, so follow the prompts on screen. The decisions are the same:",
        `<ol>
          <li><strong>Business name.</strong> Use your real name exactly as it appears on your van, invoices or sign. No added keywords or towns.</li>
          <li><strong>Category.</strong> Choose the most specific primary category that fits. You can add secondary categories later.</li>
          <li><strong>Location.</strong> When Google asks whether customers can visit your location, answer no if they cannot. Enter your address when asked; it will be hidden.</li>
          <li><strong>Service areas.</strong> Add the towns, cities or postcode areas you really serve (more on this below).</li>
          <li><strong>Contact details.</strong> Your phone number and website, exactly as they appear on your website.</li>
          <li><strong>Verification.</strong> Complete whichever method Google offers you.</li>
        </ol>`,
        "<h3>If your profile already shows your home address</h3><p>Go into the profile’s business information, find the location or address setting, clear the address so it is no longer shown, and add service areas instead. Google may review the change, and in some cases it asks you to verify again.</p>",
      ],
    },
    {
      id: "service-areas",
      toc: "Choosing service areas",
      eyebrow: "Service areas",
      heading: "How to choose your service areas.",
      band: "band-light",
      body: [
        "You can add up to 20 service areas. Google’s guidelines say the areas should not extend further than about two hours’ drive from where your business is based.",
        "Pick the places you actually want work from, in the way customers would name them. A short, accurate list is better than a long one: it tells customers straight away whether you cover them.",
        table({
          caption: "An illustration for a roofer based in Middlesbrough, not a real business",
          head: ["Choose", "Why"],
          rows: [
            ["Middlesbrough, Stockton-on-Tees, Redcar", "Where most of the work comes from"],
            ["Billingham, Thornaby, Guisborough", "Covered regularly, and named by customers who live there"],
            ["Hartlepool", "Covered, and people there search with the town name"],
            ["Not: Leeds or Newcastle", "Too far to serve properly, and it confuses customers"],
          ],
        }),
        `Setting a wide area does not mean you will appear across all of it. Where your profile shows depends on more than this setting; our guide on <a href="/resources/rank-in-google-maps-without-a-shop">how to rank in Google Maps without a shop</a> explains what else matters. List the same areas on your website, so the two agree; our own <a href="/areas">page of the areas we serve</a> is one way to set them out, and <a href="/local-seo-middlesbrough">local SEO for Teesside businesses</a> covers the website side.`,
      ],
    },
    {
      id: "verification",
      toc: "Getting verified",
      eyebrow: "Verification",
      heading: "Getting through verification.",
      body: [
        "Google decides which verification methods to offer you, and they vary from business to business. They can include a video recording, a phone call or text, an email, a live video call or a postcard sent to your address.",
        "If you are asked for a video, read Google’s on-screen instructions first and plan the recording before you press start. A few things help:",
        checklist([
          "Record in one continuous take, without cuts.",
          "Show where you are, such as the street outside or your van with its signage.",
          "Show the tools or equipment of your trade.",
          "Show something that proves you run the business, such as being able to open your work van or business paperwork with your name on.",
          "Make sure the business name you show matches the name on the profile.",
        ]),
        "While verification is pending, avoid changing the name, category or address. Edits can restart the review.",
      ],
    },
    {
      id: "mistakes",
      toc: "Mistakes to avoid",
      eyebrow: "Mistakes to avoid",
      heading: "The mistakes that get service area profiles suspended or ignored.",
      band: "band-light",
      body: [
        `<ul>
          <li><strong>Showing an address customers cannot visit.</strong> It breaks Google’s guidelines, and it can mean customers turning up at your home.</li>
          <li><strong>Using a virtual office or PO box</strong> to get an address in a bigger town.</li>
          <li><strong>Adding keywords to the business name,</strong> such as “Smith Plumbing Middlesbrough Emergency Plumber”.</li>
          <li><strong>Creating a profile for each town you cover.</strong> One business, one profile, unless you genuinely have separate staffed locations.</li>
          <li><strong>Wrong hours.</strong> Keep opening hours accurate, including bank holidays. Wrong hours lead to annoyed customers and bad reviews.</li>
          <li><strong>Details that differ from your website.</strong> Name, phone number and areas should match exactly.</li>
        </ul>`,
      ],
    },
    {
      id: "after-setup",
      toc: "After setup",
      eyebrow: "After setup",
      heading: "Once the profile is live: what to keep doing.",
      body: [
        checklist([
          "List each service individually, with a short real description.",
          "Add photos of your work, vehicles and team regularly.",
          "Ask every satisfied customer for a review using your direct link, and never offer an incentive.",
          "Reply to every review, including the bad ones, in a measured tone.",
          "Check the profile monthly for suggested edits from Google or the public that you have not approved.",
        ]),
        `For the full list, work through our <a href="/resources/local-seo-checklist">local SEO checklist</a>. If you run a trade, our page on <a href="/web-design-for-trades-teesside">website design for trades</a> shows how the website and profile fit together.`,
      ],
    },
    {
      id: "this-week",
      toc: "What to do this week",
      eyebrow: "What to do this week",
      heading: "Four things to check on your profile this week.",
      band: "band-light",
      body: [
        `<ol>
          <li>Search for your business name on your phone and check whether your home address is visible.</li>
          <li>If it is, and customers do not visit you, switch to service areas.</li>
          <li>Compare your service areas with the areas listed on your website, and make them match.</li>
          <li>Check that the business name on the profile is exactly your real name, with nothing added.</li>
        </ol>`,
        `If you would rather we did it, our <a href="/google-business-profile">Google Business Profile setup service</a> includes local SEO setup for ${price("local-seo-google-business-profile")}, excluding VAT.`,
      ],
    },
  ],
  relatedItems: [
    { href: "/google-business-profile", label: "Google Business Profile setup", text: "Categories, services, service areas and photos, set up for you." },
    { href: "/resources/rank-in-google-maps-without-a-shop", label: "Ranking in Google Maps without a shop", text: "What affects your position once the profile exists." },
    { href: "/resources/local-seo-checklist", label: "The local SEO checklist", text: "Profile, website, business details, reviews and tracking." },
  ],
  closing: {
    heading: "Not sure your profile is set up the right way?",
    body: "Ask for a free audit. We check your Google Business Profile and website together and tell you what to change, including whether your address is showing when it should not be.",
  },
});
