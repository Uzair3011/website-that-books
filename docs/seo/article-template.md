# Commercial article template

Written 28 Oct 2026, when `/resources/ai-receptionist-cost-uk` was rewritten to this structure. Use it for new articles under `/resources/<slug>` that answer a buying question (cost, "is it worth it", "do I need"). Each article is a `src/pages/resources/*.js` file built with `articlePage()` in `src/article-page.js`. The hard rules in `.cursor/rules/seo.mdc` and the keyword owner in `docs/seo/keyword-map.md` still apply.

## Structure

1. **Headline.** The search term plus the outcome the reader wants, e.g. "AI Receptionist Cost UK: What It Costs, and When It Actually Pays for Itself". The H1 carries the page's primary keyword from the keyword map.
2. **Hook.** The business problem, in 2–4 sentences, directly under the byline. Write it for the reader's trade or situation, not for the product.
3. **Answer the search query immediately.** 2–3 sentences in the "The short answer" box (`<aside class="article-summary">` in the intro). Give the real answer, including our price where it is relevant.
4. **Change the question.** Move from "what does it cost?" to "what is the problem already costing you?".
5. **Show the problem with a simple example scenario.** A few plain numbers that add up to a monthly figure, labelled as an example, followed by how the reader can work out their own.
6. **Introduce the solution simply.** What it does, in plain steps, with a link to the explainer article if there is one.
7. **Why Veltra Media.** How our implementation differs (approved answers, setup, testing, handover, what the client keeps), not "AI is amazing".
8. **Price and exactly what they get.** Our price, what is and is not included, and a link to the service page and `/pricing`.
9. **FAQ with only purchase objections.** Questions a buyer asks before paying, such as "Will customers know?", "What does usage cost?", "What if it cannot answer?". No general "what is" questions. Put `faq: [{ q, a }]` on the last section; `articlePage()` renders it and emits FAQPage JSON-LD from the same items, and `npm run seo:check` fails if they differ.
10. **ONE call to action matched to the article.** Set `closing: { heading, body, button }` in the article's own words. Set no `relatedItems`, so there is no "Read next" block competing with it. A `sources` list, if the article quotes third-party figures, sits just above the call to action.

## Rules

- **Example numbers are labelled as examples, never as client results.** Say so next to the figures ("These are example figures, not a client's results"). Never invent results, statistics, reviews or client names.
- **Prices come from the catalogue helper.** Write our prices as `price("<catalogue slug>")` from `src/article-page.js`, which reads `assets/catalog.js`, never as a typed number, so articles never drift from `/pricing`.
- **Every claim must match the service page.** What the article says we include, how usage is billed, what is confirmed in writing and what the service will not do must say the same as the matching service page. If the article needs a claim the service page does not make, change the service page first or leave the claim out.
- Third-party prices are checked on the provider's own site, dated in the copy ("checked on 27 October 2026") and listed under Sources. Recheck them whenever the article is updated.
- Every article still needs a body link to a matching service page (or `/pricing`) and to an area page or `/areas`; `npm run seo:check` enforces both.
- Keep the same URL, byline and Published date when an article is rewritten; set Updated to the day of the rewrite.
