# Owner to-do: SEO

Things only the owner can confirm or supply. Code that depends on one of these carries a `TODO(owner)` comment; nothing here is ever rendered into the site.

## Verify before relying on it

The area pages built on 13 Oct 2026 (`/web-design-stockton-on-tees`, `/web-design-redcar`, `/web-design-hartlepool`, `/areas`) use the local facts below. Each was written from general public knowledge (council, Tees Valley Combined Authority and Wikipedia-level facts), not checked against a source on the day. Tick each one after checking it, and delete or reword any that turn out to be wrong. Place names are only used to show customers how a service area could be described; the pages never claim Veltra Media has clients, staff or premises in any of these places.

### `/web-design-stockton-on-tees`

- [ ] "Stockton-on-Tees" is the official name of the town and borough; "Stockton" is the common short form.
- [ ] Billingham is part of the Borough of Stockton-on-Tees.
- [ ] Norton, Hartburn, Fairfield, Thornaby, Ingleby Barwick, Eaglescliffe and Yarm are all in the Borough of Stockton-on-Tees.
- [ ] Thornaby and Ingleby Barwick are on the south bank of the Tees.
- [ ] Stockton and Middlesbrough are neighbouring towns on the River Tees.
- [ ] Billingham grew up around the chemical works that ICI ran there for most of the twentieth century.
- [ ] Process and engineering firms still operate around Billingham.
- [ ] Billingham Forum is in Billingham.
- [ ] Wolviston and Cowpen Bewley are villages just outside Billingham.

### `/web-design-redcar`

- [ ] Redcar is a seaside town with a seafront, a beach and a racecourse.
- [ ] The Borough of Redcar and Cleveland includes Redcar, Marske-by-the-Sea, Saltburn-by-the-Sea, Guisborough, Eston, Normanby, South Bank and East Cleveland.
- [ ] Eston, Normanby and South Bank are the parts of the borough closest to Middlesbrough.
- [ ] Coatham, Dormanstown, Kirkleatham, Marske and New Marske are in or next to Redcar.
- [ ] The Redcar steelworks closed in 2015.
- [ ] Redcar's postcode district is TS10, and Marske, Saltburn and Guisborough each have their own TS district (believed to be TS11, TS12 and TS14; the page names only TS10).

### `/web-design-hartlepool`

- [ ] Hartlepool is its own borough, north of the Tees.
- [ ] The Tees Valley Combined Authority's five council areas are Darlington, Hartlepool, Middlesbrough, Redcar and Cleveland, and Stockton-on-Tees.
- [ ] Hartlepool was historically part of County Durham.
- [ ] Blackhall and Peterlee are County Durham places up the coast from Hartlepool, outside the Tees Valley.
- [ ] Owton Manor, Rift House, Clavering, Throston, the Headland, West Park and Seaton Carew are parts of Hartlepool; Middleton Grange is in the town centre; Hart, Greatham and Elwick are villages on its edge.
- [ ] The National Museum of the Royal Navy and HMS Trincomalee are at Hartlepool Marina.
- [ ] Seaton Carew has a beach and a seafront.
- [ ] Postcode districts TS24, TS25 and TS26 cover most of Hartlepool.
- [ ] Redcar is across the mouth of the Tees from Hartlepool (used in a link card).

### Opinions on the pages, not facts

These describe how people search and talk. They come from the keyword map and are not sourced claims, but check they match your experience:

- Many people in Hartlepool would not call their town "Teesside".
- People in Billingham, Thornaby, Ingleby Barwick, Saltburn and Guisborough tend to search with their own town name.

## Other open items

- [ ] **Founder details for /about.** The About page names no person, so it has no `Person` structured data. If you are happy to be named publicly, send your name as you want it shown, a two- or three-sentence bio (what you do and your relevant experience, no claims you cannot back up) and a photo you own the rights to. The page and a `Person` entity can then be added together, and the photo replaces the logo mark on the studio card in the About hero (`aboutVisual` in `src/hero-visuals.js`).
- [ ] **Details for each homepage review.** The five reviews in `src/reviews.js` show a name only, which reads as generic. For each one, confirm the reviewer's business and town (for example "Thompson Hair Studio, Stockton-on-Tees"), the service they bought, and where the original can be checked (a Google review link, or the email and its date). The card shows the business and service under the name as soon as they are added. Leave out anything the client has not agreed to publish.
- [ ] **Official profiles for `sameAs`.** Add the LinkedIn, Facebook and Google Business Profile URLs to `SITE.sameAs` in `src/site.js` once each profile is live and belongs to Veltra Media. Nothing is emitted while the list is empty.
- [ ] **Price range.** The organisation markup has no `priceRange`, because /pricing quotes larger sites, ecommerce and unusual integrations in writing, so there is no published upper price. If you want one, confirm a range you are happy to stand behind.
- Search volume for every keyword in `keyword-map.md` is unknown. Check it in Search Console or Keyword Planner.
- If you have real, permitted examples of work in any of these towns, they would make the town pages much stronger. Until then, the pages say they do not name clients.

## Resources articles (added 13 Oct 2026)

The six articles under `/resources/<slug>` were written without first-hand client stories, results or market-wide prices. Every price comes from `assets/catalog.js`, so it always matches `/pricing`.

### VERIFY: Google rules quoted in the articles

These were included because they match Google's published help pages as we understand them, but Google changes its rules and screens without notice. Check each against the current Google Business Profile help pages and tick it, or tell us to reword it.

- [ ] A service area business can add up to 20 service areas (`/resources/google-business-profile-service-area-business`).
- [ ] Google's guidelines say service areas should not extend further than about two hours' drive from where the business is based (same article).
- [ ] Businesses must make in-person contact with customers during their stated hours to be eligible; online-only businesses are not (same article).
- [ ] PO boxes, mail-forwarding addresses and virtual offices not staffed during opening hours are not eligible business addresses (service area article and `/resources/rank-in-google-maps-without-a-shop`).
- [ ] Verification methods are chosen by Google and can include a video recording, phone or text, email, live video call or postcard; the video tips (one continuous take, show location, tools and proof of management) match Google's current on-screen instructions (service area article).
- [ ] Google ranks local results on relevance, distance and prominence, and says review count and score factor into local ranking, and complete business information helps (Maps article and `/resources/local-seo-checklist`).
- [ ] Adding keywords or a town to the business name is against Google's guidelines (checklist, service area and Maps articles).
- [ ] Google's review policies forbid incentives for reviews and selectively asking only happy customers (checklist and Maps articles).
- [ ] Google's spam policies describe near-identical town pages as doorway pages (checklist article).
- [ ] The Business Profile performance figures include calls, website clicks, direction requests and searches (checklist article).

### VERIFY: left out because we were not certain

Nothing below is on the site. Confirm or correct it if you want it added.

- [ ] **UK fake-review rules.** The Digital Markets, Competition and Consumers Act 2024 is believed to ban fake reviews and concealed incentivised reviews from April 2025. Not mentioned in any article; only Google's own policies are cited.
- [ ] **PECR and missed-call text-back.** Whether an automatic text to someone who has just called you counts as a service message or as direct marketing under PECR. The AI receptionist article does not mention missed-call texts at all for this reason.
- [ ] **Telling callers they are speaking to an AI.** The article recommends it as good practice and does not claim it is a UK legal requirement.

### Questions for the owner

Answers to these would make the articles stronger. Nothing is invented in their place.

- [ ] **Named author.** Articles are bylined "Veltra Media" and the BlogPosting markup names the organisation. If you want a named author, send the name and a short bio (see the /about item above), and the byline and `author` markup can change together.
- [ ] **Typical third-party costs** (`/resources/how-much-does-a-website-cost`). What do clients usually pay for a domain, business email and, for the AI receptionist, AI provider usage per month? The article describes these costs but gives no figures.
- [ ] **Real examples.** Any anonymised, permitted example would help: a quote a client brought you to compare, a Facebook-only business that added a website, a profile you moved from a home address to service areas, a verification video that worked. The articles currently use illustrations only, labelled as such.
- [ ] **AI receptionist details** (`/resources/what-is-an-ai-receptionist`). Which phone systems and calendars you support, whether calls are recorded or transcribed by default, and how long a typical setup takes once answers are approved.
- [ ] **Review the dates.** Each article shows "Published 13 October 2026" and "Updated 13 October 2026". Change `updated` in the article file whenever the content changes materially.
