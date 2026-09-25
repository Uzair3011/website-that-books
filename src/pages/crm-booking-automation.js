import { servicePage } from "../service-page.js";

export default servicePage({
  path: "/crm-booking-automation",
  title: "CRM, Booking & Follow-up Automation | Teesside | Veltra Media",
  description:
    "Connect forms, calendars, reminders and follow-up so fewer good enquiries disappear between first contact and booked work. Consent-based, with a clear opt-out.",
  breadcrumbName: "CRM & booking automation",
  serviceName: "CRM, booking and follow-up automation",
  eyebrow: "CRM, booking + follow-up",
  h1: "Stop losing the enquiries you already won.",
  lede: "Capture leads, manage enquiries, and automate booking and follow-up — so the gap between someone getting in touch and someone booking stops being where the work disappears.",
  image: {
    src: "/assets/work/audit-deliverable.svg",
    width: 1000,
    height: 760,
    alt: "A funnel showing how many people find a business, visit, engage and finally enquire, with the drop-off between each stage highlighted.",
  },
  intro: {
    heading: "The expensive gap is after the enquiry.",
    body: [
      "Most local businesses spend their marketing budget getting people to make contact, then lose a meaningful share of those people in the days that follow — an email nobody replied to, a callback that did not happen, a booking that was never confirmed.",
      "This is the cheapest thing to fix, because the interest has already been paid for. It is also the least visible, which is why it stays broken.",
      "We connect the pieces you already have — your forms, your calendar, your inbox or CRM — so an enquiry becomes a confirmed appointment with as few manual steps as possible, and so nothing sits unanswered simply because everyone was busy.",
    ],
  },
  includedHeading: "What gets connected",
  included: {
    heading: "Joining up what you already use.",
    items: [
      {
        title: "Enquiry capture into one place",
        text: "Website forms, chat conversations and phone enquiries landing in a single list with the context attached, instead of three separate inboxes.",
      },
      {
        title: "Live calendar booking",
        text: "Real availability from your calendar shown on your site, with the appointment created, the video link generated where relevant, and double-bookings prevented.",
      },
      {
        title: "Confirmation and reminders",
        text: "An immediate confirmation the customer can rely on, then a reminder before the appointment — which is the single most effective reduction in no-shows.",
      },
      {
        title: "CRM handover",
        text: "Enquiries forwarded into your CRM or automation platform over a secure webhook, so your existing pipeline keeps working.",
      },
      {
        title: "Consent-based follow-up",
        text: "A short, useful follow-up sequence for people who did not book, that stops immediately on a reply or an opt-out. No indefinite drip campaigns.",
      },
      {
        title: "Review requests",
        text: "A compliant prompt to satisfied customers at the right moment, which feeds directly back into local search visibility.",
      },
    ],
  },
  fitHeading: "Where it fits",
  fit: {
    heading: "The last mile of every other service.",
    body: "This is the service that makes the others pay. It is also the one that is easiest to justify, because you can count what was recovered.",
    items: [
      {
        label: "From SEO",
        title: "More enquiries arrive",
        text: "Visibility only matters if the enquiries it produces get handled.",
      },
      {
        label: "From the site",
        title: "Forms actually deliver",
        text: "A form that silently fails is worse than no form. Delivery is confirmed, not assumed.",
      },
      {
        label: "From chat",
        title: "Conversations become bookings",
        text: "The receptionist captures intent; this converts it into a time in the diary.",
      },
      {
        label: "After",
        title: "Nothing goes quiet",
        text: "Reminders and follow-up run whether or not anyone remembered.",
      },
    ],
  },
  price: {
    heading: "CRM and booking automation from £395.",
    body: "£395 one-off setup covering enquiry capture, calendar booking, confirmations and reminders. Follow-up sequences and review requests can be added. Third-party platform fees, where any apply, are always shown at cost before you commit.",
  },
  faqs: [
    {
      q: "Do I need to change my current booking system?",
      a: "<p>Usually not. We assess what already works — Google Calendar, Calendly, or your existing provider — and connect to it where its permissions allow. We confirm compatibility and any extra cost before you sign, rather than discovering it mid-project.</p>",
    },
    {
      q: "Will follow-up messages annoy my customers?",
      a: "<p>They should not, because the sequences are short, useful and consent-based, and they stop the moment someone replies or opts out. If a follow-up sequence would not be welcome, we will say so rather than build it.</p>",
    },
    {
      q: "What if the automation fails?",
      a: "<p>It is built to fail loudly rather than silently. If a booking cannot be confirmed, the customer is told plainly and no time is reserved. If an enquiry cannot be delivered, the sender is told it was not sent rather than shown a false confirmation.</p>",
    },
  ],
  relatedItems: [
    {
      href: "/ai-automation-middlesbrough",
      label: "AI receptionist + website chat",
      text: "Capture the enquiry before it needs following up.",
    },
    {
      href: "/local-seo-middlesbrough",
      label: "Local SEO + Google Business Profile",
      text: "Review requests feed straight back into local visibility.",
    },
    {
      href: "/free-website-audit",
      label: "Free website & Google audit",
      text: "We will show you where in the journey people drop out.",
    },
  ],
});
