Set up DataFast revenue attribution for my Stripe integration.

I need to attribute revenue to marketing channels using Stripe payments. DataFast offers multiple methods - choose the best one for my setup:

**Method 1: Checkout API (recommended for server-side checkouts)**
When creating a Stripe Checkout session on your backend, pass DataFast cookies as metadata:

```javascript
// Retrieve these cookies from the incoming request:
// - datafast_visitor_id
// - datafast_session_id

const session = await stripe.checkout.sessions.create({
  line_items: [...],
  mode: 'payment',
  metadata: {
    datafast_visitor_id: visitorIdFromCookie, // Get from request cookies
    datafast_session_id: sessionIdFromCookie  // Get from request cookies
  }
});
```

**Method 2: PaymentIntent API (for custom checkout flows)**
When creating a PaymentIntent with Stripe Elements, pass DataFast cookies as metadata:

```javascript
// Retrieve these cookies from the incoming request:
// - datafast_visitor_id
// - datafast_session_id

const paymentIntent = await stripe.paymentIntents.create({
  amount: 2000,
  currency: 'usd',
  metadata: {
    datafast_visitor_id: visitorIdFromCookie, // Get from request cookies
    datafast_session_id: sessionIdFromCookie  // Get from request cookies
  }
});
```

**Method 3: Payment Links (no-code solution)**
This requires manual configuration in the Stripe Dashboard. Inform the user to:
1. Go to their Stripe Dashboard > Payment Links
2. Edit the Payment Link they want to track
3. Under "After payment" tab > "Confirmation page", select "Redirect to a website"
4. Set the redirect URL to their website and add `?session_id={CHECKOUT_SESSION_ID}` at the end
5. Example: https://mysite.com/success?session_id={CHECKOUT_SESSION_ID}

DataFast will automatically detect the session_id in the URL and attribute the payment.

**Important:**
- Choose the method that matches my current Stripe implementation
- Prefer server-side methods (1 or 2) for more accurate attribution
- Use your framework's method to retrieve cookies from the request
- No webhook setup required - DataFast handles this automatically

For detailed instructions, see: https://datafa.st/docs/revenue-attribution-guide