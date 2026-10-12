// Keyword map: owns "how to rank in Google Maps without a shop". No "service
// area business" or town name in the title or H1, and no ranking promise. The
// three factors are Google's own published ones (relevance, distance,
// prominence); see docs/seo/owner-todo.md for the Google rules to recheck.
import { articlePage, checklist, table } from "../../article-page.js";

export default articlePage({
  slug: "rank-in-google-maps-without-a-shop",
  title: "How to Rank in Google Maps Without a Shop | Veltra Media",
  description:
    "How to rank in Google Maps without a shop or office: what Google says it looks at, what you can change, what to avoid, and a monthly routine that fits.",
  shortName: "Ranking in Google Maps without a shop",
  kind: "Guide",
  summary: "What Google says decides the map results, what you can change without a shop, and a monthly routine.",
  eyebrow: "Guide · Google Maps",
  h1: "How to rank in Google Maps without a shop or office",
  published: "2026-10-13",
  intro: [
    "If you work from home or travel to your customers, you can still appear in Google Maps. This guide explains how to rank in Google Maps without a shop: what Google says it looks at, which parts you can change, which you cannot, and a realistic routine to follow each month. Nobody can promise you a position in the map, and you should be wary of anyone who does. What you can do is give Google every reason to show you.",
  ],
  sections: [
    {
      id: "how-google-decides",
      toc: "How Google decides",
      eyebrow: "Google’s own explanation",
      heading: "What Google says decides the map results.",
      body: [
        "Google publishes the three main things it uses to rank local results. They apply to businesses with and without a shop:",
        table({
          head: ["Factor", "What Google means", "Can you change it?"],
          rows: [
            ["Relevance", "How well your profile matches what someone searched for", "Yes: categories, services, description and your website"],
            ["Distance", "How far you are from the place in the search, or from the person searching", "No, and you should not try"],
            ["Prominence", "How well known and trusted your business is", "Yes, slowly: reviews, your website, mentions elsewhere"],
          ],
        }),
        "Google also says that a complete, accurate profile helps, and that review count and review score are part of prominence. Everything in this guide comes back to these three factors.",
        `This guide assumes you already have a profile set up without a public address. If not, start with our guide to <a href="/resources/google-business-profile-service-area-business">setting up a Google Business Profile as a service area business</a>.`,
      ],
    },
    {
      id: "distance",
      toc: "Distance: the fixed part",
      eyebrow: "The fixed part",
      heading: "Distance is the part you cannot change.",
      band: "band-light",
      body: [
        "Distance is measured from the location in the search, such as “roofer Redcar”, or from where the person is if they just search “roofer near me”. You cannot move closer to every customer, and inventing an address to try is against Google’s guidelines. Virtual offices and PO boxes are not allowed as business addresses, and profiles using them can be suspended.",
        "That has two practical consequences:",
        `<ul>
          <li><strong>Expect to show more easily near where you are based</strong> than in towns further out. Adding a service area does not cancel out distance.</li>
          <li><strong>Use your website for the places further away.</strong> A genuinely useful page about the work you do in a town can appear in the ordinary results below the map, where distance matters less.</li>
        </ul>`,
      ],
    },
    {
      id: "what-you-can-change",
      toc: "What you can change",
      eyebrow: "Relevance and prominence",
      heading: "How to rank in Google Maps without a shop: what you can change",
      body: [
        "These are the levers you control. Work through them in order.",
        "<h3>Relevance</h3>",
        checklist([
          "Primary category: the most specific one that describes your main service.",
          "Secondary categories: only for services you really offer.",
          "Services list: every service, named the way customers say it, with a short description.",
          "Description: what you do and where, in plain sentences, not a keyword list.",
          "Website link: point it to the page that best matches your main service if your homepage is general.",
        ]),
        "<h3>Prominence</h3>",
        checklist([
          "A steady flow of genuine Google reviews, with a reply to each one.",
          "A website with a clear page for each main service, and your details matching the profile.",
          "Accurate listings on other sites: directories, trade bodies, local groups.",
          "Real mentions and links from local organisations you work with, sponsor or belong to.",
          "Recent photos and updates on the profile, so it is clearly an active business.",
        ]),
        `For a fuller list covering the profile, website and business details, use our <a href="/resources/local-seo-checklist">local SEO checklist</a>.`,
      ],
    },
    {
      id: "reviews",
      toc: "Reviews",
      eyebrow: "Reviews",
      heading: "Reviews: a steady habit, not a one-off push.",
      band: "band-light",
      body: [
        "Asking twenty customers in one week and then stopping for six months looks odd to customers and does little for you. Ask every customer, every time, at the end of the job.",
        "Here is a message you could adapt and send by text or email:",
        "<blockquote><p>“Thanks again for having us round today. If you were happy with the work, a short Google review would really help a small business like ours: [your review link]. If anything was not right, please reply here and I will sort it.”</p></blockquote>",
        "The last line matters. It gives an unhappy customer a direct route to you, while still asking everyone. Do not send the review link only to customers you expect to be happy: Google’s policies do not allow selectively asking for positive reviews, and they do not allow incentives for reviews either.",
        `If you forget to ask, automate it. Our <a href="/crm-booking-automation">booking and follow-up automation</a> can send a review request after each completed job.`,
      ],
    },
    {
      id: "website",
      toc: "Your website’s part",
      eyebrow: "Your website",
      heading: "How your website supports the map listing.",
      body: [
        "Google reads your website to understand your business, and customers check it before they call. Without a shop, it is also your best tool for towns further from your base.",
        checklist([
          "One page for each main service, with real detail: what is included, typical prices, what happens on the day.",
          "Your areas written out in words, on the homepage and the contact page.",
          "A town page only where you have something genuinely useful to say about working there. Copies with the town name swapped help nobody.",
          "Your business name, phone number and areas identical to the profile.",
          "Photos of real jobs, with a short note on what the job was and where.",
        ]),
        "<h3>If you cover several towns</h3><p>Start with the town you are based in and the one or two where most of your work comes from. For each, ask whether you can write something a customer there would find useful: the kinds of jobs you do there, how quickly you can usually get there, whether parking or access is ever an issue, the questions people there tend to ask. If you can, a page for that town is worth writing. If all you can say is the town’s name, leave it as a line in your list of areas instead.</p>",
        "<h3>Link the profile to the right page</h3><p>If most of your work is one service, link your profile to that service’s page rather than a general homepage, so people who tap through land on the answer they wanted.</p>",
      ],
    },
    {
      id: "what-to-avoid",
      toc: "What to avoid",
      eyebrow: "What to avoid",
      heading: "Shortcuts that put your profile at risk.",
      band: "band-light",
      body: [
        `<ul>
          <li><strong>A fake or virtual address</strong> in a bigger town to get closer to more searches.</li>
          <li><strong>Keywords in the business name,</strong> such as adding “Emergency Electrician Stockton” to your real name.</li>
          <li><strong>Fake reviews,</strong> including reviews from friends posing as customers, or buying reviews.</li>
          <li><strong>Several profiles for one business,</strong> one per town, without real staffed locations.</li>
          <li><strong>Anyone selling a guaranteed map position.</strong> Google controls the results; nobody can guarantee them.</li>
        </ul>`,
        "Any of these can get a profile suspended. Getting it reinstated takes time, and during that time customers cannot find you at all.",
      ],
    },
    {
      id: "monthly-routine",
      toc: "A monthly routine",
      eyebrow: "A monthly routine",
      heading: "A monthly routine that takes about an hour.",
      body: [
        "Spread it across the month, or do it all on one evening:",
        table({
          head: ["When", "Task"],
          rows: [
            ["Week 1", "Check hours, phone number and categories. Approve or reject any suggested edits."],
            ["Week 2", "Add three to five photos of recent work. Post one update about a job or service."],
            ["Week 3", "Reply to every new review. Check you asked every customer from the past month."],
            ["Week 4", "Look at the profile’s performance figures and your own tally of how customers found you."],
          ],
        }),
        "Results from this kind of work build slowly. Judge it over several months, not weeks, and judge it on enquiries, not on where you appear when you search for yourself.",
      ],
    },
    {
      id: "this-week",
      toc: "What to do this week",
      eyebrow: "What to do this week",
      heading: "Three things to do this week.",
      band: "band-light",
      body: [
        `<ol>
          <li>Rewrite your profile’s services list so every service you offer is there, in customers’ words.</li>
          <li>Save your review link and send it to every customer from the past fortnight, using the message above.</li>
          <li>Check that your website names the same areas as your profile, in words.</li>
        </ol>`,
        `If you would rather have it done for you, our <a href="/local-seo-middlesbrough">local SEO service for Middlesbrough and Teesside</a> sets up the profile, the website structure and your business details together.`,
      ],
    },
  ],
  relatedItems: [
    { href: "/local-seo-middlesbrough", label: "Local SEO in Middlesbrough", text: "Profile, website structure and business details, set up for you." },
    { href: "/resources/google-business-profile-service-area-business", label: "Setting up without a public address", text: "Hiding your address, choosing areas and verifying." },
    { href: "/resources/local-seo-checklist", label: "The local SEO checklist", text: "Everything to check, in the order worth doing it." },
  ],
  closing: {
    heading: "Doing all of this and still not showing up?",
    body: "Ask for a free audit. We look at your profile, your website and the businesses you are up against, and tell you what is most likely holding you back.",
  },
});
