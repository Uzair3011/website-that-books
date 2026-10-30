// Keyword map: owns "do I need a website if I have a Facebook page". Links to
// /web-design-middlesbrough and /web-design-for-trades-teesside. No statistics
// about Facebook reach or usage are quoted: we have none we can source.
import { articlePage, checklist, price, table } from "../../article-page.js";

export default articlePage({
  slug: "do-i-need-a-website-if-i-have-facebook",
  title: "Do I Need a Website If I Have a Facebook Page | Veltra Media",
  description:
    "Is a Facebook page enough for a small business? What a page does well, where it falls short, when it can wait and the smallest website worth having.",
  shortName: "Do I need a website if I have Facebook?",
  kind: "Guide",
  summary: "What a Facebook page does well, where it falls short, and the smallest website that covers the gap.",
  eyebrow: "Guide · Getting started",
  h1: "Do I need a website if I already have a Facebook page?",
  published: "2026-10-13",
  intro: [
    "Do I need a website if I have a Facebook page? It is a fair question. Plenty of local businesses started on Facebook, get messages through it and post their work there every week. The honest answer is that a Facebook page is a good extra and a weak foundation. This guide explains why, when a page on its own is enough for now, and what the smallest useful website looks like if you decide you need one.",
  ],
  sections: [
    {
      id: "short-answer",
      toc: "The short answer",
      eyebrow: "The short answer",
      heading: "So, do I need a website if I have a Facebook page?",
      body: [
        "If most of your work comes from people who already know you, a Facebook page may be enough for now. If you want new customers who have never heard of you, especially people searching Google for your service and your town, you will be held back without a website and a Google Business Profile.",
        "The two do different jobs. Here they are side by side:",
        table({
          head: ["", "Facebook page", "Your own website"],
          rows: [
            ["Who sets the rules", "Meta. Layout, features and rules can change without asking you.", "You. It works the way you decide."],
            ["Who it reaches", "Mostly people who follow you, or see your posts shared.", "Anyone who searches for what you do, or is given the link."],
            ["Searches for your service and town", "Google can show a public Facebook page, but most often for searches for your business name.", "Can be built around the services and places people search for."],
            ["Structure", "One page with a feed. Older posts are hard to find.", "A page for each service, area, price list or question."],
            ["Visitors without a Facebook account", "May be asked to log in while they look around.", "Nothing to log into."],
            ["If the account is locked or hacked", "Your page can disappear while you sort it out.", "Unaffected."],
          ],
        }),
      ],
    },
    {
      id: "facebook-strengths",
      toc: "What Facebook does well",
      eyebrow: "Credit where it is due",
      heading: "What a Facebook page does well for a local business.",
      band: "band-light",
      body: [
        "This is not an argument for deleting your page. Facebook is good at things a website is not:",
        checklist([
          "<strong>Staying in touch.</strong> People who already like your business see your updates without having to look for you.",
          "<strong>Showing recent work.</strong> Photos of a finished kitchen, a new menu or a busy Saturday are quick to post and easy to share.",
          "<strong>Local word of mouth.</strong> People ask for recommendations in local groups, and a page makes it easy for others to tag you.",
          "<strong>Quick messages.</strong> Many customers are happy to send a message on Facebook rather than fill in a form.",
          "<strong>Low effort to start.</strong> A page is free and you can set one up in an evening.",
        ]),
        "If those things bring you enough work, keep doing them. A website should support the page, not replace it.",
      ],
    },
    {
      id: "facebook-limits",
      toc: "Where it falls short",
      eyebrow: "The limits",
      heading: "Where a Facebook page on its own falls short.",
      body: [
        "<h3>You are building on someone else’s land</h3><p>Your page lives on a platform you do not control. Meta decides how the page looks, what features it has, and who sees your posts. Accounts do get locked, hacked or restricted, and getting help can be slow. If your page is your only presence online, that is a single point of failure for your whole business.</p>",
        "<h3>It is not built for people who do not know you yet</h3><p>Someone in need of a plumber, a cleaner or a mobile hairdresser usually starts with a Google search. For searches like that, Google mostly shows Business Profiles in the map and websites in the results underneath. A Facebook page is rarely what they find for a service and a town.</p>",
        "<h3>The important information gets buried</h3><p>Your prices, the areas you cover and what happens on the first visit end up in old posts. A customer who wants to check whether you cover their village has to scroll, or message you and wait. Many will not bother.</p>",
        "<h3>Not everyone uses Facebook</h3><p>Some people do not have an account and do not want one. If they click a link to your page and are asked to log in, you may lose them before they read anything.</p>",
      ],
    },
    {
      id: "when-to-wait",
      toc: "When it can wait",
      eyebrow: "Your situation",
      heading: "When a page on its own is enough, and when it is time for a website.",
      band: "band-light",
      body: [
        "Use this table to be honest with yourself. If most of your answers are in the right-hand column, a website is worth the money.",
        table({
          head: ["", "Facebook alone is fine for now", "Time for a website"],
          rows: [
            ["Where work comes from", "Mostly repeat customers and referrals", "You want new customers from search"],
            ["How busy you are", "Fully booked for weeks ahead", "Gaps in the diary you want to fill"],
            ["Areas you cover", "One small area where people know you", "Several towns or a wide area"],
            ["What you sell", "Simple and easy to explain in a post", "Several services, prices or options that need explaining"],
            ["Advertising", "None planned", "Running or planning Google or Facebook ads"],
            ["Your plans", "A side business or a short-term trial", "A business you want to grow"],
          ],
        }),
        `Trades are a good example. Most people looking for an electrician or a roofer search Google, compare two or three businesses and call one. Our page on <a href="/web-design-for-trades-teesside">website design for trades</a> explains what a trades website needs to win that call.`,
      ],
    },
    {
      id: "smallest-website",
      toc: "The smallest useful website",
      eyebrow: "Start small",
      heading: "The smallest website that covers the gap.",
      body: [
        "You do not need a large site to fix the problems above. For many local businesses, one well-built page is enough to start. It should have:",
        checklist([
          "A first line that says what you do and where, in plain words.",
          "The towns and areas you cover, written out in full.",
          "Your services, with prices or at least a starting price.",
          "Photos of your real work, not stock images.",
          "A phone number you can tap on a mobile, and a short enquiry form.",
          "A few words on what happens after someone gets in touch.",
          "Links to your Facebook page and your Google reviews.",
        ]),
        `A <a href="/landing-page-design">simple one-page landing page</a> with all of that is ${price("landing-page")} with us. If you need a page per service, a multi-page website is ${price("multi-page-website")}. Both exclude VAT. For a fuller picture of build and running costs, read <a href="/resources/how-much-does-a-website-cost">how much a website costs for a small business</a>.`,
        `Alongside the website, set up a free Google Business Profile. If you work from home or travel to customers, our guide on <a href="/resources/google-business-profile-service-area-business">setting up a profile as a service area business</a> walks through it.`,
      ],
    },
    {
      id: "use-both",
      toc: "Using both together",
      eyebrow: "Use both",
      heading: "How to make a Facebook page and a website work together.",
      band: "band-light",
      body: [
        "The best setup for most local businesses is both, each doing its own job. A few habits make them support each other:",
        `<ul>
          <li><strong>Put your website address on your page.</strong> In the About section and the button at the top of the page.</li>
          <li><strong>Keep your details identical.</strong> The same business name, phone number and areas on Facebook, the website and Google.</li>
          <li><strong>Post, then point.</strong> When you post a job on Facebook, link to the matching service page on your website for prices and details.</li>
          <li><strong>Answer the same questions once.</strong> If people keep asking about prices or areas in messages, put the answer on the website and send the link.</li>
          <li><strong>Check where enquiries come from.</strong> Ask new customers how they found you. After a few months you will know which one earns its keep.</li>
        </ul>`,
      ],
    },
    {
      id: "this-week",
      toc: "What to do this week",
      eyebrow: "What to do this week",
      heading: "Five things to do this week, whatever you decide.",
      body: [
        `<ol>
          <li><strong>Search for your service and your town</strong> on Google, on your phone, signed out. Note who appears and whether you do.</li>
          <li><strong>Open your Facebook page signed out</strong> and see what a stranger sees. Can they find your prices and areas in ten seconds?</li>
          <li><strong>Turn on two-factor authentication</strong> on the Facebook account that manages your page, and make sure a second person you trust has access.</li>
          <li><strong>Write down your services, prices and areas</strong> in one place. It is the content of your first web page.</li>
          <li><strong>Ask your last five new customers how they found you.</strong> The answer tells you whether a website is urgent.</li>
        </ol>`,
        `If you are near Middlesbrough and decide a website is worth it, our <a href="/web-design-middlesbrough">web design service in Middlesbrough</a> publishes every price before you get in touch. We also build sites for businesses in <a href="/web-design-stockton-on-tees">Stockton-on-Tees and Billingham</a>, <a href="/web-design-redcar">Redcar</a> and <a href="/web-design-hartlepool">Hartlepool</a>.`,
      ],
    },
  ],
  relatedItems: [
    { href: "/web-design-middlesbrough", label: "Web design in Middlesbrough", text: `A clear, fast site for a local business, from ${price("landing-page")}.` },
    { href: "/web-design-for-trades-teesside", label: "Websites for trades", text: "What a trades website needs to win the call." },
    { href: "/resources/how-much-does-a-website-cost", label: "What a website really costs", text: "The build, the running costs and the extras." },
  ],
  closing: {
    heading: "Not sure whether a website would make a difference?",
    body: "Send us your Facebook page. The free audit looks at how customers can find you now and tells you honestly whether a website is worth it yet.",
  },
});
