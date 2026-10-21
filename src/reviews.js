// Client reviews for the homepage. The section stays hidden until this list
// has at least one entry, and every entry must be a real review from a real
// client: inventing or editing reviews is illegal under the UK's Digital
// Markets, Competition and Consumers Act 2024. `source` records where the
// review can be checked (a Google review link, or "Email, 12 October 2026"),
// and `npm test` fails without it.
//
// `business`, `service` and `rating` are optional: leave out whatever the client
// did not say (no rating means no stars are shown). `name`, `text` and
// `source` are required.
//
// Example entry:
// {
//   name: "Sarah Thompson",
//   business: "Thompson Hair Studio, Stockton-on-Tees",
//   service: "Website design",
//   rating: 5,
//   text: "What the client actually said, word for word.",
//   source: "https://g.page/r/...",
// },
export const REVIEWS = [
  {
    name: "Keith Reidy",
    rating: 5,
    text: "Excellent agency! Always available, highly knowledgeable, and a pleasure to work with. I’ll definitely be working with them again!",
    source: "Supplied by the Veltra Media owner, 21 October 2026 (replace with a link to the original)",
  },
  {
    name: "Camilla Webster",
    rating: 5,
    text: "Great experience working with this team. They helped streamline our workflows and made our daily operations much more efficient. Looking forward to working with them again.",
    source: "Supplied by the Veltra Media owner, 21 October 2026 (replace with a link to the original)",
  },
  {
    name: "Viladhimir Lobachev",
    rating: 5,
    text: "Outstanding web development services! The team is professional, attentive to detail, and committed to delivering quality work. Highly recommended for anyone looking to improve their website.",
    source: "Supplied by the Veltra Media owner, 21 October 2026 (replace with a link to the original)",
  },
  {
    name: "Mervyn Lee",
    rating: 5,
    text: "Very professional and reliable team. They delivered a modern website with excellent attention to detail. I would definitely work with them again.",
    source: "Supplied by the Veltra Media owner, 21 October 2026 (replace with a link to the original)",
  },
  {
    name: "Brian Zheng",
    rating: 5,
    text: "Reliable, responsive, and professional from start to finish. They communicate clearly, understand the requirements, and make the entire process smooth and straightforward.",
    source: "Supplied by the Veltra Media owner, 21 October 2026 (replace with a link to the original)",
  },
];
