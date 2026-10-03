// Client reviews for the homepage. The section stays hidden until this list
// has at least one entry, and every entry must be a real review from a real
// client: inventing or editing reviews is illegal under the UK's Digital
// Markets, Competition and Consumers Act 2024. `source` records where the
// review can be checked (a Google review link, or "Email, 12 October 2026"),
// and `npm test` fails without it.
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
export const REVIEWS = [];
