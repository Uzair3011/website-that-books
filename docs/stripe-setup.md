# Stripe setup, step by step

This takes you from "no Stripe account" to a working £1 test payment, then to the real website.
Everything here is in **test mode**: no real money moves until you finish Part 4.

**What a webhook is:** after someone pays, Stripe sends a message to the website saying
"payment succeeded" (or failed, or was refunded). The website listens at
`/api/stripe-webhook` and updates the payment in Supabase. A webhook is that message, and
"adding a webhook" means telling Stripe where to send it.

---

## Part 1: Get your test secret key (about 5 minutes)

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com) and sign in, or create an account.
   Test mode needs no business details or bank account.
2. Switch to **test mode**: use the **Test mode** toggle at the top right. Some newer accounts
   call this a **Sandbox** instead, and either works.
3. Open **Developers → API keys**. Next to **Secret key**, click **Reveal test key** and copy it.
   It starts with `sk_test_`.
4. In the project folder, open the file `.env` and add this line on its own:

   ```
   STRIPE_SECRET_KEY=sk_test_paste_your_key_here
   ```

   Treat this key like a password. Don't paste it into chat, email or the code.

---

## Part 2: Test on your computer

On your own computer there is no public web address for Stripe to send webhooks to. Stripe's
free command-line tool solves that by relaying the messages to your computer, so you don't need
to set anything up in the Stripe dashboard for this part.

1. Install the Stripe CLI (once):

   ```sh
   brew install stripe/stripe-cli/stripe
   ```

2. Connect it to your account (once). A browser window opens: click **Allow access**.

   ```sh
   stripe login
   ```

3. Start the relay and **leave this terminal window open**:

   ```sh
   stripe listen --forward-to localhost:4174/api/stripe-webhook
   ```

   It prints a line like `Your webhook signing secret is whsec_…`. Copy that value into `.env`:

   ```
   STRIPE_WEBHOOK_SECRET=whsec_paste_it_here
   ```

4. In a second terminal, start the website with payments on:

   ```sh
   SITE_URL=http://localhost:4174 node --env-file=.env --env-file=.env.local scripts/dev.mjs
   ```

5. Open <http://localhost:4174/checkout?service=test-payment>, fill in your details and pay with:

   | Card | What it tests |
   | --- | --- |
   | `4242 4242 4242 4242` | Payment succeeds |
   | `4000 0000 0000 0002` | Card is declined |
   | `4000 0000 0000 9995` | Declined: insufficient funds |
   | `4000 0025 0000 3155` | Bank asks for 3-D Secure approval |

   For each card, use any future expiry date (e.g. `12/34`), any 3-digit CVC and any postcode.

6. **Check it worked:**
   - The success page says **Payment received**.
   - The `stripe listen` window shows events ending in `[200]`.
   - At <http://localhost:4174/admin> → **Payments** → **Test** tab, the payment shows as **Paid**.
7. **Try the other cases:**
   - **Cancel:** on Stripe's page, click the back arrow. You land on "No payment was taken".
   - **Refund:** in the Stripe dashboard, open **Payments**, click the payment, then **Refund**.
     `/admin` changes to **Refunded** within seconds.

Claude can run steps 1, 3, 4 and the checks for you. You only need to click **Allow access**
in step 2 and paste your key in Part 1.

---

## Part 3: Add the webhook for the real website

Do this only when the code is deployed, because Stripe needs a public address to send to.

1. In the Stripe dashboard (still in test mode) open **Developers → Webhooks**.
2. Click **Add endpoint**. Newer dashboards say **Add destination** instead: choose
   **Webhook endpoint** when it asks.
3. **Endpoint URL:** the website address followed by `/api/stripe-webhook`, for example
   `https://www.veltramedia.com/api/stripe-webhook`.
4. **Events to send:** click **Select events** and tick these six:
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
   - `checkout.session.async_payment_failed`
   - `checkout.session.expired`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Click **Add endpoint** / **Create destination**.
6. On the endpoint's page, find **Signing secret**, click **Reveal** and copy it (`whsec_…`).
   This is a different secret from the one `stripe listen` printed in Part 2.
7. In **Vercel → the `website-that-books` project → Settings → Environment Variables**, add
   these two, each marked **Sensitive**:
   - `STRIPE_SECRET_KEY` = your `sk_test_…` key
   - `STRIPE_WEBHOOK_SECRET` = the `whsec_…` from step 6

   Then redeploy. The buy buttons only appear after a deploy with both set.
8. Buy the £1 test payment on the deployed site. Back on the Stripe endpoint page, the
   **Event deliveries** list should show each event with status **200**.

**Things that commonly go wrong**

- **Stripe shows 401 errors on a Vercel preview link.** Vercel's Deployment Protection blocks
  Stripe from reaching previews. Under **Vercel → Settings → Deployment Protection**, either
  turn on **Protection Bypass for Automation** (and add the bypass to the endpoint URL), or
  test on a deployment that isn't protected.
- **Checkout says "Please submit your request from the Veltra Media website", or Stripe sends
  customers back to the wrong site.** `SITE_URL` must be the exact address that deployment
  is served at (the preview's address for a preview, `https://www.veltramedia.com` for
  production).
- **Events show 400 (invalid signature).** `STRIPE_WEBHOOK_SECRET` doesn't match this
  endpoint. Copy it again from step 6 and redeploy.
- Test mode and live mode have **separate** webhook endpoints and separate secrets.

---

## Part 4: Going live (only when you decide)

1. In Stripe, **activate your account**: business details, identity and a bank account for payouts.
2. Switch the dashboard to **live mode** and copy the live secret key (`sk_live_…`).
3. Repeat Part 3 in live mode to create a **live** webhook endpoint with its own secret.
4. In Vercel (Production), replace the two Stripe values with the live ones and add
   `STRIPE_LIVE_PAYMENTS` = `enabled`. Without this switch, a live key does nothing on purpose.
5. Redeploy. The £1 test payment disappears automatically in live mode.

Before going live, decide on VAT (`STRIPE_TAX_RATE_ID`) and have the terms checked for online
sales. In **Stripe → Settings**, also set **Branding** (logo, `#071313`, `#C9FF4A`) and turn
on payment and refund receipt **Emails**.
